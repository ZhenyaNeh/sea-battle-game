import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { Hit } from 'src/rooms/dto/hit.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { PlayerDocument } from 'src/rooms/schemas/player.schema';
import {
  getRadarZone,
  getSurroundingCells,
  handleRocketShot,
  shipFireHit,
  shipOverlaps,
} from 'src/utils/game.utils';

@Injectable()
export class GameplayService {
  private activeSockets: Map<string, Socket> = new Map();

  constructor(private readonly roomsService: RoomsService) {}

  registerSocket(userId: string, socket: Socket) {
    this.activeSockets.set(userId, socket);
  }

  unregisterSocket(userId: string) {
    this.activeSockets.delete(userId);
  }

  getSocket(userId: string): Socket | undefined {
    return this.activeSockets.get(userId);
  }

  async getOpponentId(userId: string, roomId: string) {
    const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    return opponent ? opponent.userId : null;
  }

  async handleFire(
    roomId: string,
    x: number,
    y: number,
    player: PlayerDocument,
    opponent: PlayerDocument,
  ) {
    // const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    // const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    if (!player || !opponent) return [];

    const hitShip = opponent.playerState.find((ship) =>
      shipFireHit(ship, x, y),
    );

    if (!player.playerActions || !Array.isArray(player.playerActions)) {
      player.playerActions = [];
      player.markModified('playerActions');
    }

    if (!hitShip) {
      await this.changeTurn(roomId);
    }

    if (hitShip) {
      opponent.playerState.forEach((ship) => {
        if (ship.id === hitShip.id) {
          opponent.markModified('playerState');
          ship.health -= 1;
          if (ship.health < 0) {
            ship.health = 0;
          }
        }
      });
      await opponent.save();
    }

    const existingHits = new Set(
      player.playerActions.map((hit) => `${hit.x},${hit.y}`),
    );

    const hits: Hit[] = [{ x, y, hit: !!hitShip }];
    if (hitShip && hitShip.health === 0) {
      hits.push(...getSurroundingCells(hitShip));
    }

    const newUniqueHits = hits.filter(
      (hit) => !existingHits.has(`${hit.x},${hit.y}`),
    );

    player.playerActions.push(...newUniqueHits);
    player.markModified('playerActions');
    await player.save();

    return hits ? hits : [];
  }

  async handleFireWitoutTurn(
    x: number,
    y: number,
    player: PlayerDocument,
    opponent: PlayerDocument,
  ) {
    // const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    // const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    if (!player || !opponent) return [];

    const hitShip = opponent.playerState.find((ship) =>
      shipFireHit(ship, x, y),
    );

    if (!player.playerActions || !Array.isArray(player.playerActions)) {
      player.playerActions = [];
      player.markModified('playerActions');
    }

    if (hitShip) {
      opponent.playerState.forEach((ship) => {
        if (ship.id === hitShip.id) {
          opponent.markModified('playerState');
          ship.health -= 1;
        }
        if (ship.health < 0) {
          ship.health = 0;
        }
      });
      await opponent.save();
    }

    const existingHits = new Set(
      player.playerActions.map((hit) => `${hit.x},${hit.y}`),
    );

    const hits: Hit[] = [{ x, y, hit: !!hitShip }];
    if (hitShip && hitShip.health === 0) {
      hits.push(...getSurroundingCells(hitShip));
    }

    const newUniqueHits = hits.filter(
      (hit) => !existingHits.has(`${hit.x},${hit.y}`),
    );

    player.playerActions.push(...newUniqueHits);
    player.markModified('playerActions');
    await player.save();

    return hits ? hits : [];
  }

  async processFire(userId: string, roomId: string, x: number, y: number) {
    const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);
    if (!player || !opponent) return;

    const existingMove = Array.isArray(player.playerActions)
      ? player.playerActions.find((move) => move.x === x && move.y === y)
      : null;
    if (existingMove) {
      return {
        hits: [{ x, y, hit: false }],
        error: 'You already shot at this cell',
      };
    }

    const hits = await this.handleFire(roomId, x, y, player, opponent);

    return { hits: hits ? hits : [], error: '' };
  }

  async processBrokenWeapon(
    userId: string,
    roomId: string,
    x: number,
    y: number,
  ) {
    const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    if (!player || !opponent) return;
    const hits = await this.handleFire(roomId, x, y, player, opponent);
    return { hits: hits ? hits : [], error: '' };
  }

  async processMine(userId: string, roomId: string, x: number, y: number) {
    const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    // Проверяем, был ли уже такой выстрел
    if (!player || !opponent) return;
    const existingMove = Array.isArray(player.playerActions)
      ? player.playerActions.find((move) => move.x === x && move.y === y)
      : null;
    if (existingMove) {
      return {
        hits: [{ x, y, hit: false }],
        error: 'You already shot at this cell',
      };
    }

    const hits = await this.handleFireWitoutTurn(x, y, player, opponent);

    return { hits: hits, error: '' };
  }

  async processRocket(
    userId: string,
    roomId: string,
    centerX: number,
    centerY: number,
  ) {
    const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    const rocketCells = handleRocketShot(centerX, centerY);

    if (!player || !opponent) return;
    // const existingMove = Array.isArray(player.playerActions)
    //   ? player.playerActions.find(
    //       (move) => move.x === centerX && move.y === centerY,
    //     )
    //   : null;
    // if (existingMove) {
    //   return {
    //     hits: [{ x: centerX, y: centerY, hit: false }],
    //     error: 'You already shot at this cell',
    //   };
    // }

    const hits = await this.handleFireWitoutTurn(
      centerX,
      centerY,
      player,
      opponent,
    );
    for (const [x, y] of rocketCells) {
      hits?.push(...(await this.handleFireWitoutTurn(x, y, player, opponent)));
    }

    const changeTurn = hits.find((hit) => hit.hit === true);
    if (!changeTurn) {
      await this.changeTurn(roomId);
    }

    return { hits: hits, error: '' };
  }

  async processRadar(userId: string, roomId: string, x: number, y: number) {
    const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    if (!player || !opponent) return { hits: [] };
    await this.changeTurn(roomId);
    const hits = getRadarZone(x, y, opponent.playerState);
    return { hits: hits };
  }

  async processStorm(userId: string, roomId: string) {
    const [player, opponent] = await Promise.all([
      this.roomsService.getPlayerInRoom(userId, roomId),
      this.roomsService.getOpponentInRoom(userId, roomId),
    ]);

    if (!player || !opponent) return;
    const playerDestroyedShips = player.playerState.filter(
      (ship) => ship.health === 0,
    );

    const cellsNearDestroyedShips: Hit[] = [];
    for (const ship of playerDestroyedShips) {
      cellsNearDestroyedShips.push(...getSurroundingCells(ship));
    }

    const existingHits = new Set(
      cellsNearDestroyedShips.map((hit) => `${hit.x},${hit.y}`),
    );

    if (!opponent.playerActions || !Array.isArray(opponent.playerActions)) {
      opponent.playerActions = [];
      opponent.markModified('playerActions');
    }

    opponent.playerActions = opponent.playerActions.filter((hit) => {
      return hit.hit || existingHits.has(`${hit.x},${hit.y}`);
    });

    // Попытка сдвинуть полностью целые корабли
    const directions = [
      { dx: 0, dy: -1 }, // вверх
      { dx: 0, dy: 1 }, // вниз
      { dx: -1, dy: 0 }, // влево
      { dx: 1, dy: 0 }, // вправо
    ];

    const boardSize = 9;

    const movedShips = new Set<number>();

    for (const ship of player.playerState) {
      const maxHealth = Math.max(ship.w + 1, ship.h + 1);
      if (ship.health !== maxHealth || movedShips.has(ship.id)) continue;

      const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

      for (const dir of shuffledDirs) {
        const newX = ship.x + dir.dx;
        const newY = ship.y + dir.dy;

        // Проверка границ
        if (
          newX < 0 ||
          newY < 0 ||
          newX + ship.h > boardSize ||
          newY + ship.w > boardSize
        ) {
          continue;
        }

        const tempShip = {
          ...ship,
          x: newX,
          y: newY,
        };

        // Проверка пересечений со всеми кораблями
        const overlaps = player.playerState.some((other) => {
          if (other.id === ship.id) return false;
          return shipOverlaps(tempShip, other);
        });

        if (!overlaps) {
          ship.x = newX;
          ship.y = newY;
          movedShips.add(ship.id);
          break;
        }
      }
    }

    player.markModified('playerState');
    opponent.markModified('playerActions');

    await Promise.all([player.save(), opponent.save()]);
    await this.changeTurn(roomId);
    return {
      playerState: player.playerState,
      playerAction: opponent.playerActions,
    };
  }

  async changeTurn(roomId: string) {
    const room = await this.roomsService.findRoomById(roomId);

    if (room) {
      room.isCreatorTurn = !room.isCreatorTurn;
      room.markModified('isCreatorTurn');
      await room.save();
    }
  }

  async getCurrentTurn(userId: string, roomId: string) {
    return await this.roomsService.isCurrentUserTurn(userId, roomId);
  }

  async checkGameOver(userId: string, roomId: string) {
    const player = await this.roomsService.getPlayerInRoom(userId, roomId);
    const opponent = await this.roomsService.getOpponentInRoom(userId, roomId);

    if (player && player?.playerState) {
      const gameOver = player.playerState.filter((ship) => ship.health !== 0);
      if (gameOver.length === 0 && opponent && opponent?.playerState) {
        const liveShips = opponent.playerState.filter(
          (ship) => ship.health !== 0,
        );
        const health = liveShips.reduce((acc, val) => acc + val.health, 0);

        return {
          winner: opponent.userId.toString(),
          loser: player.userId.toString(),
          health,
        };
      }
    }

    if (opponent && opponent?.playerState) {
      const gameOver = opponent.playerState.filter((ship) => ship.health !== 0);
      if (gameOver.length === 0 && player && player?.playerState) {
        const liveShips = player.playerState.filter(
          (ship) => ship.health !== 0,
        );
        const health = liveShips.reduce((acc, val) => acc + val.health, 0);

        return {
          winner: player.userId.toString(),
          loser: opponent.userId.toString(),
          health,
        };
      }
    }

    return null;
  }

  async updateRoomStatus(
    roomId: string,
    newStatus: 'waiting' | 'in_progress' | 'completed',
  ) {
    // Проверяем валидность статуса
    const validStatuses = ['waiting', 'in_progress', 'completed'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      );
    }

    return await this.roomsService.updateRoomStatus(roomId, newStatus);
  }

  async updateGatewayGameOver(
    roomId: string,
    userId: string,
    socket: Socket,
    opponentId: Types.ObjectId,
  ) {
    const gameOverUser = await this.checkGameOver(userId, roomId);

    if (opponentId && gameOverUser) {
      const opponentSocket = this.getSocket(opponentId.toString());
      this.updateRoomStatus(roomId, 'completed');
      this.updateWinner(roomId, userId);
      this.updateRating(
        gameOverUser.winner,
        gameOverUser.loser,
        gameOverUser.health,
        roomId,
      );
      socket.emit('game_over', { winner: gameOverUser.winner });
      opponentSocket?.emit('game_over', { winner: gameOverUser.winner });
    }
  }

  async updateWinner(roomId: string, userId: string) {
    return this.roomsService.updateWinner(roomId, userId);
  }

  async updateRating(
    winner: string,
    loser: string,
    health: number,
    roomId: string,
  ) {
    return await this.roomsService.updateRating(winner, loser, health, roomId);
  }
}
