import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from './matchmaking.service';
import { Ship } from './dto/ship.dto';

@WebSocketGateway({ namespace: '/matchmaking' })
export class MatchmakingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private matchmakingService: MatchmakingService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.auth?.userId as string;
    if (!userId) {
      socket.disconnect();
      return;
    }
    this.matchmakingService.registerSocket(userId, socket);
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.handshake.auth?.userId as string;
    this.matchmakingService.unregisterSocket(userId);
  }

  @SubscribeMessage('search')
  handleSearch(
    socket: Socket,
    data: { gameId: string; rating: number; ships: Ship[]; friendId?: string },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    return this.matchmakingService.searchGame(
      userId,
      data.gameId,
      data.ships,
      data.rating,
      // data.friendId,
    );
  }

  @SubscribeMessage('cancel_search')
  handleCancelSearch(socket: Socket, data: { gameId: string }) {
    const userId = socket.handshake.auth?.userId as string;
    return this.matchmakingService.cancelSearch(userId, data.gameId);
  }

  @SubscribeMessage('ready')
  async handleReady(
    socket: Socket,
    payload: { roomId: string; ships: Ship[] },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    return this.matchmakingService.handlePlayerReady(
      userId,
      payload.roomId,
      payload.ships,
    );
  }

  @SubscribeMessage('cancel_ready')
  handleCancelReady(socket: Socket, payload: { roomId: string }) {
    const userId = socket.handshake.auth?.userId as string;
    return this.matchmakingService.handleCancelReady(userId, payload.roomId);
  }
}
