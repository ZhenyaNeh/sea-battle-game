import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalrequestService } from './globalrequest.service';

@WebSocketGateway({ namespace: '/globalrequest' })
export class GlobalrequestGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private globalrequestService: GlobalrequestService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.auth?.userId as string;
    if (!userId) {
      socket.disconnect();
      return;
    }
    this.globalrequestService.registerSocket(userId, socket);
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.handshake.auth?.userId as string;
    this.globalrequestService.unregisterSocket(userId);
  }

  @SubscribeMessage('/friendRequest')
  async friendRequest(socket: Socket, data: { friendId: string }) {
    const userId = socket.handshake.auth?.userId as string;

    const friendShip = await this.globalrequestService.friendRequest(
      userId,
      data.friendId,
    );

    if (friendShip) {
      const opponentSocket = this.globalrequestService.getSocket(data.friendId);
      opponentSocket?.emit('friend_request', friendShip);
      return friendShip;
    }
  }

  @SubscribeMessage('/friendAccept')
  async friendAccept(socket: Socket, data: { friendId: string }) {
    const userId = socket.handshake.auth?.userId as string;
    const friendShip = await this.globalrequestService.friendAccept(
      userId,
      data.friendId,
    );

    if (friendShip) {
      const opponentSocket = this.globalrequestService.getSocket(data.friendId);
      opponentSocket?.emit('friend_accept', friendShip);
      return friendShip;
    }
  }

  @SubscribeMessage('/friendReject')
  async friendReject(socket: Socket, data: { friendId: string }) {
    const userId = socket.handshake.auth?.userId as string;
    const friendShip = await this.globalrequestService.friendReject(
      userId,
      data.friendId,
    );

    if (friendShip) {
      const opponentSocket = this.globalrequestService.getSocket(data.friendId);
      opponentSocket?.emit('friend_reject', friendShip);
      return friendShip;
    }
  }

  //   @SubscribeMessage('cancel_search')
  //   handleCancelSearch(socket: Socket, data: { gameId: string }) {
  //     const userId = socket.handshake.auth?.userId as string;
  //     return this.matchmakingService.cancelSearch(userId, data.gameId);
  //   }

  @SubscribeMessage('invite_friend')
  handleInviteFriend(
    socket: Socket,
    data: { gameId: string; friendId: string },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    return this.globalrequestService.inviteFriend(
      userId,
      data.friendId,
      data.gameId,
    );
  }

  @SubscribeMessage('accept_invite')
  async handleAcceptInvite(socket: Socket, data: { invitationId: string }) {
    const userId = socket.handshake.auth?.userId as string;
    return await this.globalrequestService.acceptInvite(
      userId,
      data.invitationId,
    );
  }

  @SubscribeMessage('decline_invite')
  handleDeclineInvite(socket: Socket, data: { invitationId: string }) {
    const userId = socket.handshake.auth?.userId as string;
    return this.globalrequestService.declineInvite(userId, data.invitationId);
  }
}
