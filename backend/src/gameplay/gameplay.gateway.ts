import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameplayService } from './gameplay.service';

@WebSocketGateway({ namespace: '/gameplay' })
export class GameplayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private gameplayService: GameplayService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.auth?.userId as string;
    if (!userId) {
      socket.disconnect();
      return;
    }
    this.gameplayService.registerSocket(userId, socket);
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.handshake.auth?.userId as string;
    this.gameplayService.unregisterSocket(userId);
  }

  @SubscribeMessage('fire')
  async handleFire(
    socket: Socket,
    data: { x: number; y: number; roomId: string },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    const result = await this.gameplayService.processFire(
      userId,
      data.roomId,
      data.x,
      data.y,
    );

    if (result && result.error !== '') {
      socket.emit('fire_error', { error: result.error });
      return;
    }

    const opponentId = await this.gameplayService.getOpponentId(
      userId,
      data.roomId,
    );

    if (opponentId && result && result.error === '') {
      const opponentSocket = this.gameplayService.getSocket(
        opponentId.toString(),
      );
      socket.emit('fire_result', result.hits);
      opponentSocket?.emit('opponent_fire', result.hits);
    }

    // Проверяем, закончилась ли игра
    if (opponentId) {
      await this.gameplayService.updateGatewayGameOver(
        data.roomId,
        userId,
        socket,
        opponentId,
      );
    }
  }

  @SubscribeMessage('broken_weapon')
  async handleBrokenWeapon(
    socket: Socket,
    data: { x: number; y: number; roomId: string },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    const result = await this.gameplayService.processBrokenWeapon(
      userId,
      data.roomId,
      data.x,
      data.y,
    );

    if (result && result.error !== '') {
      socket.emit('fire_error', { error: result.error });
      return;
    }

    const opponentId = await this.gameplayService.getOpponentId(
      userId,
      data.roomId,
    );

    if (opponentId && result && result.error === '') {
      const opponentSocket = this.gameplayService.getSocket(
        opponentId.toString(),
      );
      socket.emit('fire_result', result.hits);
      opponentSocket?.emit('opponent_fire', result.hits);
    }

    if (opponentId) {
      await this.gameplayService.updateGatewayGameOver(
        data.roomId,
        userId,
        socket,
        opponentId,
      );
    }
  }

  @SubscribeMessage('mine')
  async handleMine(
    socket: Socket,
    data: { x: number; y: number; roomId: string },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    const result = await this.gameplayService.processFire(
      userId,
      data.roomId,
      data.x,
      data.y,
    );

    if (result && result.error !== '') {
      socket.emit('fire_error', { error: result.error });
      return;
    }

    const opponentId = await this.gameplayService.getOpponentId(
      userId,
      data.roomId,
    );

    if (opponentId && result && result.error === '') {
      const opponentSocket = this.gameplayService.getSocket(
        opponentId.toString(),
      );
      socket.emit('fire_result', result.hits);
      opponentSocket?.emit('opponent_fire', result.hits);

      if (Math.random() < 0.75) {
        const resultOpponent = await this.gameplayService.processMine(
          opponentId.toString(),
          data.roomId,
          data.x,
          data.y,
        );
        if (resultOpponent) {
          socket.emit('opponent_fire', resultOpponent.hits);
          opponentSocket?.emit('fire_result', resultOpponent.hits);
        }
      }
    }

    if (opponentId) {
      await this.gameplayService.updateGatewayGameOver(
        data.roomId,
        userId,
        socket,
        opponentId,
      );
    }
  }

  @SubscribeMessage('rocket')
  async handleRocket(
    socket: Socket,
    data: { x: number; y: number; roomId: string },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    const result = await this.gameplayService.processRocket(
      userId,
      data.roomId,
      data.x,
      data.y,
    );

    if (result && result.error !== '') {
      socket.emit('fire_error', { error: result.error });
      return;
    }

    const opponentId = await this.gameplayService.getOpponentId(
      userId,
      data.roomId,
    );

    if (opponentId && result && result.error === '') {
      const opponentSocket = this.gameplayService.getSocket(
        opponentId.toString(),
      );
      socket.emit('fire_result', result.hits);
      opponentSocket?.emit('opponent_fire', result.hits);
    }

    if (opponentId) {
      await this.gameplayService.updateGatewayGameOver(
        data.roomId,
        userId,
        socket,
        opponentId,
      );
    }
  }

  @SubscribeMessage('radar')
  async handleRadar(
    socket: Socket,
    data: { x: number; y: number; roomId: string },
  ) {
    const userId = socket.handshake.auth?.userId as string;
    const result = await this.gameplayService.processRadar(
      userId,
      data.roomId,
      data.x,
      data.y,
    );

    const opponentId = await this.gameplayService.getOpponentId(
      userId,
      data.roomId,
    );

    if (opponentId && result) {
      const opponentSocket = this.gameplayService.getSocket(
        opponentId.toString(),
      );
      socket.emit('radar_result', result.hits);
      opponentSocket?.emit('radar_opponent_result');
    }
  }

  @SubscribeMessage('storm')
  async handleStorm(socket: Socket, data: { roomId: string }) {
    const userId = socket.handshake.auth?.userId as string;
    const result = await this.gameplayService.processStorm(userId, data.roomId);

    const opponentId = await this.gameplayService.getOpponentId(
      userId,
      data.roomId,
    );

    if (opponentId && result) {
      const opponentSocket = this.gameplayService.getSocket(
        opponentId.toString(),
      );
      socket.emit('storm_result', {
        playerState: result.playerState,
        playerAction: result.playerAction,
      });
      opponentSocket?.emit('opponent_storm', {
        playerAction: result.playerAction,
      });
    }
  }
}
