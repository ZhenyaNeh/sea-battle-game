import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RoomsService } from 'src/rooms/rooms.service';
import { Ship } from './dto/ship.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MatchmakingService {
  private activeSockets: Map<string, Socket> = new Map(); // Храним подключения
  private readyPlayers = new Map<string, Set<string>>();

  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private getQueueKey(gameId: string): string {
    return `matchmaking:${gameId}`;
  }

  async searchGame(
    userId: string,
    gameId: string,
    ships: Ship[],
    rating: number,
    // friendId?: string,
  ) {
    const queueKey = this.getQueueKey(gameId);

    const data = await this.redis.lpop(queueKey);
    if (data) {
      const opponent = JSON.parse(data) as {
        userId: string;
        ships: Ship[];
      };
      const opponentPlayer = await this.usersService.findOneById(
        opponent.userId,
      );
      if (!opponentPlayer) return;
      const isRatingWithinRange =
        Math.abs(rating - opponentPlayer.rating) <= 1000;

      if (
        opponent.userId &&
        opponent.userId !== userId &&
        isRatingWithinRange
      ) {
        const room = await this.roomsService.createRoomWithShips(
          { gameId: gameId, privacy: 'public' },
          userId,
          ships,
        );

        if (room) {
          await this.roomsService.joinRoomWithShips(
            room._id.toString(),
            opponent.userId,
            opponent.ships,
          );

          this.notifyMatchFound(userId, room._id.toString());
          this.notifyMatchFound(opponent.userId, room._id.toString());

          return { status: 'matched', roomId: room._id.toString() };
        }
      }
    } else {
      // Никого нет — добавляем себя в очередь
      await this.redis.rpush(queueKey, JSON.stringify({ userId, ships }));
      return { status: 'searching' };
    }
  }

  async cancelSearch(userId: string, gameId: string) {
    const queueKey = this.getQueueKey(gameId);
    await this.redis.lrem(queueKey, 0, userId);
    return { status: 'cancelled' };
  }

  async handlePlayerReady(userId: string, roomId: string, ships: Ship[]) {
    const room = await this.roomsService.getRoom(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    const playerOpponent = await this.roomsService.getOpponentInRoom(
      userId,
      roomId,
    );

    if (!player || player.roomId.toString() !== roomId) {
      throw new Error('User is not a member of this room');
    }

    player.playerState = ships;
    player.markModified('playerState');
    player.save();

    if (!this.readyPlayers.has(roomId)) {
      this.readyPlayers.set(roomId, new Set());
    }
    this.readyPlayers.get(roomId)!.add(userId);

    if (this.readyPlayers.get(roomId)!.size === 2) {
      const players = this.readyPlayers.get(roomId);
      if (players) {
        for (const playerReadyId of players) {
          this.notifyMatchFound(playerReadyId, roomId);
        }
      }
      this.readyPlayers.delete(roomId);
      return { status: 'game_starting' };
    }

    if (playerOpponent && playerOpponent.userId) {
      this.activeSockets
        .get(playerOpponent.userId.toString())
        ?.emit('opponent_ready');
    }

    return { status: 'waiting_for_opponent' };
  }

  async handleCancelReady(userId: string, roomId: string) {
    const playerOpponent = await this.roomsService.getOpponentInRoom(
      userId,
      roomId,
    );
    if (this.readyPlayers.has(roomId)) {
      this.readyPlayers.get(roomId)!.delete(userId);
      if (playerOpponent && playerOpponent.userId) {
        this.activeSockets
          .get(playerOpponent.userId.toString())
          ?.emit('opponent_cancelled');
      }
    }
    return { status: 'ready_cancelled' };
  }

  registerSocket(userId: string, socket: Socket) {
    this.activeSockets.set(userId, socket);
  }

  unregisterSocket(userId: string) {
    this.activeSockets.delete(userId);
  }

  notifyMatchFound(userId: string, roomId: string) {
    this.activeSockets.get(userId)?.emit('match_found', { roomId });
  }
}
