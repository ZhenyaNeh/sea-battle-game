import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FriendsService } from 'src/friends/friends.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { v4 } from 'uuid';

interface PendingInvitation {
  id: string;
  fromUserId: string;
  toUserId: string;
  gameId: string;
  createdAt: Date;
}

@Injectable()
export class GlobalrequestService {
  private activeSockets: Map<string, Socket> = new Map();
  private pendingInvitations: Map<string, PendingInvitation> = new Map();

  constructor(
    private readonly friendsService: FriendsService,
    private readonly roomService: RoomsService,
  ) {}

  registerSocket(userId: string, socket: Socket) {
    this.activeSockets.set(userId, socket);
  }

  unregisterSocket(userId: string) {
    this.activeSockets.delete(userId);
  }

  getSocket(userId: string): Socket | undefined {
    return this.activeSockets.get(userId);
  }

  // notifyMatchFound(userId: string, roomId: string) {
  //   this.activeSockets.get(userId)?.emit('match_found', { roomId });
  // }

  async friendRequest(userId: string, friendId: string) {
    return await this.friendsService.create(userId, friendId);
  }

  async friendAccept(userId: string, friendId: string) {
    return await this.friendsService.update(userId, friendId, 'accepted');
  }

  async friendReject(userId: string, friendId: string) {
    return await this.friendsService.update(userId, friendId, 'rejected');
  }

  inviteFriend(userId: string, friendId: string, gameId: string) {
    // Проверяем, онлайн ли друг
    if (!this.activeSockets.has(friendId)) {
      return { status: 'error', message: 'Friend is offline' };
    }

    // Создаем приглашение
    const invitationId = v4();
    const invitation: PendingInvitation = {
      id: invitationId,
      fromUserId: userId,
      toUserId: friendId,
      gameId,
      createdAt: new Date(),
    };

    // Сохраняем приглашение
    this.pendingInvitations.set(invitationId, invitation);

    // Отправляем уведомление другу
    this.activeSockets.get(friendId)?.emit('friend_invite', {
      invitationId,
      fromUserId: userId,
      gameId,
    });

    return { status: 'invited', invitationId };
  }

  async acceptInvite(userId: string, invitationId: string) {
    const invitation = this.pendingInvitations.get(invitationId);

    if (!invitation || invitation.toUserId !== userId) {
      return { status: 'error', message: 'Invalid invitation' };
    }

    // Создаем комнату
    const room = await this.roomService.createRoom(
      { gameId: invitation.gameId, privacy: 'private' },
      invitation.fromUserId,
    );

    if (room) {
      await this.roomService.joinRoom(room._id.toString(), userId);

      // Уведомляем обоих игроков
      this.activeSockets
        .get(userId)
        ?.emit('invite_match_found', { roomId: room._id.toString() });
      this.activeSockets
        .get(invitation.fromUserId)
        ?.emit('invite_match_found', { roomId: room._id.toString() });

      // Удаляем приглашение
      this.pendingInvitations.delete(invitationId);

      return { status: 'matched', roomId: room._id.toString() };
    }

    return { status: 'error', message: 'Failed to create room' };
  }

  declineInvite(userId: string, invitationId: string) {
    const invitation = this.pendingInvitations.get(invitationId);

    if (!invitation || invitation.toUserId !== userId) {
      return { status: 'error', message: 'Invalid invitation' };
    }

    // Уведомляем отправителя об отклонении
    this.activeSockets.get(invitation.fromUserId)?.emit('invite_declined', {
      invitationId,
      byUserId: userId,
    });

    // Удаляем приглашение
    this.pendingInvitations.delete(invitationId);

    return { status: 'declined' };
  }
}
