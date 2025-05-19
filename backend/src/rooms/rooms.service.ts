// src/rooms/rooms.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { Player } from './schemas/player.schema';
import { Ship } from 'src/matchmaking/dto/ship.dto';
import { RoomResponseDto } from './dto/room-response.dto';
import { PlayerResponseDto } from './dto/player-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    private usersService: UsersService,
  ) {}

  // Создание комнаты
  async createRoom(dto: CreateRoomDto, creatorId: string) {
    const room = await this.roomModel.create({
      ...dto,
      creatorId: creatorId,
    });

    const user = await this.usersService.findOneById(creatorId);

    // Создаем запись игрока-создателя
    if (user) {
      await this.playerModel.create({
        userId: creatorId,
        roomId: room._id,
        currentRating: user.rating,
        playerState: { ships: [] },
        playerActions: { moves: [] },
      });

      return room;
    }

    return null;
  }

  // Создание комнаты с короблями
  async createRoomWithShips(
    dto: CreateRoomDto,
    creatorId: string,
    ships: Ship[],
  ) {
    const room = await this.roomModel.create({
      ...dto,
      creatorId: creatorId,
    });

    const user = await this.usersService.findOneById(creatorId);

    // Создаем запись игрока-создателя
    if (user) {
      await this.playerModel.create({
        userId: creatorId,
        roomId: room._id,
        currentRating: user.rating,
        playerState: ships,
        playerActions: { moves: [] },
      });

      return room;
    }

    return null;
  }

  // Вход в комнату
  async joinRoom(roomId: string, userId: string) {
    const user = await this.usersService.findOneById(userId);

    if (user) {
      return this.playerModel.create({
        userId: userId,
        roomId: new Types.ObjectId(roomId),
        currentRating: user.rating,
        playerState: { ships: [] },
        playerActions: { moves: [] },
      });
    }

    return null;
  }

  async joinRoomWithShips(roomId: string, userId: string, ships: Ship[]) {
    const user = await this.usersService.findOneById(userId);

    if (user) {
      return this.playerModel.create({
        userId: userId,
        // roomId: roomId,
        roomId: new Types.ObjectId(roomId),
        currentRating: user.rating,
        playerState: ships,
        playerActions: { moves: [] },
      });
    }

    return null;
  }

  async getRoom(roomId: string) {
    const room = await this.roomModel
      .findById(new Types.ObjectId(roomId))
      .exec();
    return room;
  }

  async getPlayerInRoom(userId: string, roomId: string) {
    const player = await this.playerModel
      .findOne({ roomId: new Types.ObjectId(roomId), userId })
      .exec();
    if (player) return player;
    return null;
  }

  async isCurrentUserTurn(userId: string, roomId: string) {
    const player = await this.roomModel
      .findById(new Types.ObjectId(roomId))
      .exec();
    // if (player?.creatorId.toString() === userId) return { isCreator: true };
    if (player?.creatorId.toString() === userId) {
      return { isCreatorTurn: player?.isCreatorTurn };
    }

    return { isCreatorTurn: !player?.isCreatorTurn };
  }

  async getOpponentInRoom(userId: string, roomId: string) {
    const opponent = await this.playerModel
      .findOne({
        roomId: new Types.ObjectId(roomId),
        userId: { $ne: userId },
      })
      .exec();

    if (opponent) return opponent;
    return null;
  }

  async getOpponentPlayerInRoom(userId: string, roomId: string) {
    const opponentPlayer = await this.playerModel
      .findOne({
        roomId: new Types.ObjectId(roomId),
        userId: { $ne: userId },
      })
      .exec();

    if (opponentPlayer) {
      const opponent = await this.usersService.findOneById(
        opponentPlayer?.userId.toString(),
      );

      if (opponent) {
        return {
          nickname: opponent.nickname,
          rating: opponentPlayer.currentRating || 0,
          playerActions: opponentPlayer.playerActions,
          avatarUrl: opponent.avatarUrl,
        };
      }
    }

    return null;
  }

  async updateRoomStatus(
    roomId: string,
    newStatus: 'waiting' | 'in_progress' | 'completed',
  ) {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(
        new Types.ObjectId(roomId),
        { status: newStatus },
        { new: true, runValidators: true },
      )
      .exec();

    if (updatedRoom) return updatedRoom;
    return null;
  }

  async updateWinner(roomId: string, userId: string) {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(
        new Types.ObjectId(roomId),
        { winner: userId },
        { new: true, runValidators: true },
      )
      .exec();

    if (updatedRoom) return updatedRoom;
    return null;
  }

  async isGameOver(userId: string, roomId: string) {
    const room = await this.roomModel.findById(new Types.ObjectId(roomId));

    if (room?.status === 'completed') {
      const winnerUser = await this.playerModel.findOne({
        userId: room.winner,
        roomId: new Types.ObjectId(roomId),
      });
      const opponent = await this.playerModel
        .findOne({
          roomId: new Types.ObjectId(roomId),
          userId: { $ne: userId },
        })
        .exec();

      const user = await this.playerModel
        .findOne({
          roomId: new Types.ObjectId(roomId),
          userId,
        })
        .exec();
      const liveShips = winnerUser?.playerState.filter(
        (ship) => ship.health !== 0,
      );
      return {
        status: room.status,
        winner: room.winner,
        liveShips: liveShips?.length || 0,
        opponentShips: opponent?.playerState,
        userScore: user?.matchScore || 0,
        opponentScore: opponent?.matchScore || 0,
      };
    }

    return {
      status: 'in_progress',
      winner: '',
      liveShips: 0,
      opponentShips: null,
    };
  }

  async updateRating(
    winner: string,
    loser: string,
    health: number,
    roomId: string,
  ) {
    const winnerScore = 40;
    const loserScore = 20 + health;

    await Promise.all([
      this.playerModel.updateOne(
        { userId: winner, roomId: new Types.ObjectId(roomId) },
        { matchScore: winnerScore },
      ),
      this.playerModel.updateOne(
        { userId: loser, roomId: new Types.ObjectId(roomId) },
        { matchScore: loserScore },
      ),
    ]);

    return await this.usersService.updateRating(winner, loser, health);
  }

  // Поиск комнаты по ID
  async findRoomById(roomId: string) {
    return await this.roomModel.findById(new Types.ObjectId(roomId)).exec();
  }

  async getGameID(roomId: string) {
    const room = await this.roomModel
      .findById(new Types.ObjectId(roomId))
      .exec();

    return { gameId: room?.gameId };
  }

  // Поиск публичных комнат для игры
  async findPublicRooms(gameId: string): Promise<Room[]> {
    return this.roomModel
      .find({ gameId: gameId, privacy: 'public', status: 'waiting' })
      .exec();
  }

  async getCountGames(userId: string) {
    const players = await this.playerModel
      .find({ userId: userId })
      .populate<{
        roomId: { winner: string; status: string };
      }>('roomId', 'winner status')
      .lean();

    const allGameCount = players.length;
    let winGameCount = 0;
    let loseGameCount = 0;
    if (allGameCount > 0) {
      winGameCount = players.filter(
        (player) =>
          player.userId.toString() === player.roomId.winner.toString(),
      ).length;
      loseGameCount = allGameCount - winGameCount;
    }

    return {
      allGames: allGameCount,
      winnerGames: winGameCount,
      loseGames: loseGameCount,
    };
  }

  async getRatingHistory(userId: string) {
    const ratingHistory = await this.playerModel
      .find({ userId })
      .sort({ createdAt: 1 })
      .select('currentRating createdAt -_id');

    return ratingHistory;
  }

  async getMonthlyWinLoss(userId: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // Дата 6 месяцев назад

    const results = await this.playerModel.aggregate<{
      month: number;
      year: number;
      wins: number;
      losses: number;
    }>([
      {
        $match: { userId },
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },
      {
        $unwind: '$room',
      },
      {
        $match: {
          'room.createdAt': { $gte: sixMonthsAgo }, // Фильтр: только записи за последние 6 месяцев
        },
      },
      {
        $addFields: {
          isWinner: { $eq: [{ $toString: '$userId' }, '$room.winner'] },
          month: { $month: '$room.createdAt' },
          year: { $year: '$room.createdAt' }, // Добавляем год для корректной сортировки
        },
      },
      {
        $group: {
          _id: {
            month: '$month',
            year: '$year', // Группируем по месяцу и году
          },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$isWinner', true] }, 1, 0],
            },
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ['$isWinner', false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          wins: 1,
          losses: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 }, // Сортируем по году и месяцу
      },
    ]);

    return results;
  }

  async getMonthlyAverageRatings(userId: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // Дата 6 месяцев назад

    const results = await this.playerModel.aggregate<{
      month: number;
      year: number;
      averageRating: number;
    }>([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          averageRating: { $avg: '$currentRating' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          averageRating: 1,
        },
      },
    ]);

    const formatResult = results.map((item) => ({
      ...item,
      averageRating: Math.round(item.averageRating),
    }));

    return formatResult;
  }

  async getCompletedGamesStatsLast6Months() {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); // 6 месяцев включая текущий

    return this.roomModel.aggregate<{
      month: number;
      year: number;
      count: number;
    }>([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          count: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);
  }

  async getWinLossStatsLast6Months() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    return this.playerModel.aggregate<{
      month: number;
      year: number;
      wins: number;
      losses: number;
    }>([
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
          pipeline: [
            {
              $match: {
                status: 'completed',
                createdAt: { $gte: sixMonthsAgo },
              },
            },
          ],
        },
      },
      {
        $unwind: '$room',
      },
      {
        $group: {
          _id: {
            month: { $month: '$room.createdAt' },
            year: { $year: '$room.createdAt' },
          },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$userId', '$room.winner'] }, 1, 0],
            },
          },
          losses: {
            $sum: {
              $cond: [{ $ne: ['$userId', '$room.winner'] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          wins: 1,
          losses: 1,
        },
      },
    ]);
  }

  async getGameTypeStatsLast6Months() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    return this.roomModel.aggregate<{
      month: number;
      year: number;
      classicCount: number;
      eventCount: number;
    }>([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            gameType: '$gameId',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            month: '$_id.month',
            year: '$_id.year',
          },
          classicCount: {
            $sum: {
              $cond: [
                {
                  $eq: ['$_id.gameType', 'sea-battle-classic'],
                },
                '$count',
                0,
              ],
            },
          },
          eventCount: {
            $sum: {
              $cond: [
                {
                  $eq: ['$_id.gameType', 'sea-battle-event'],
                },
                '$count',
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          classicCount: 1,
          eventCount: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);
  }

  async getLastThreeGames(userId: string) {
    return await this.playerModel.aggregate<{
      roomId: string;
      winner: string;
      gameId: string;
      matchScore: number;
    }>([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: 'rooms', // название коллекции комнат в MongoDB
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },
      {
        $unwind: '$room',
      },
      {
        $project: {
          roomId: '$room._id',
          winner: '$room.winner',
          gameId: '$room.gameId',
          matchScore: 1,
        },
      },
    ]);
  }

  // async getAllUnfinishedGame(page: number, limit: number = 15) {
  //   const skip = (page - 1) * limit; // Рассчитываем сколько документов пропустить

  //   return await this.roomModel.aggregate<{
  //     roomId: string;
  //     status: string;
  //     minutesAgo: number;
  //     totalCount: number;
  //   }>([
  //     {
  //       $match: {
  //         status: { $ne: 'completed' },
  //         createdAt: {
  //           $lt: new Date(Date.now() - 60 * 60 * 1000),
  //         },
  //       },
  //     },
  //     {
  //       $facet: {
  //         metadata: [{ $count: 'total' }],
  //         data: [
  //           { $skip: skip },
  //           { $limit: limit },
  //           {
  //             $project: {
  //               roomId: '$_id',
  //               status: 1,
  //               minutesAgo: {
  //                 $floor: {
  //                   $divide: [{ $subtract: [new Date(), '$createdAt'] }, 60000],
  //                 },
  //               },
  //               _id: 0,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $project: {
  //         rooms: '$data',
  //         total: { $arrayElemAt: ['$metadata.total', 0] },
  //       },
  //     },
  //   ]);
  // }

  async getAllUnfinishedGame(page: number, limit: number = 15) {
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.roomModel
        .find({
          status: { $ne: 'completed' },
          createdAt: { $lt: new Date(Date.now() - 60 * 60 * 1000) },
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.roomModel
        .countDocuments({
          status: { $ne: 'completed' },
          createdAt: { $lt: new Date(Date.now() - 60 * 60 * 1000) },
        })
        .exec(),
    ]);

    return {
      data: rooms.map((room) => ({
        roomId: room._id,
        status: room.status,
        minutesAgo: Math.floor(
          (new Date().getTime() - new Date(room.createdAt).getTime()) / 60000,
        ),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // async deleteRoomWithPlayers(roomId: string) {
  //   const session = await this.roomModel.db.startSession();
  //   session.startTransaction();

  //   try {
  //     const deletePlayersResult = await this.playerModel.deleteMany(
  //       { roomId: new Types.ObjectId(roomId) },
  //       { session },
  //     );

  //     const deleteRoomResult = await this.roomModel.deleteOne(
  //       { _id: new Types.ObjectId(roomId) },
  //       { session },
  //     );

  //     await session.commitTransaction();

  //     return {
  //       deletedRoom: deleteRoomResult.deletedCount > 0,
  //       deletedPlayers: deletePlayersResult.deletedCount,
  //     };
  //   } catch (error) {
  //     await session.abortTransaction();
  //     throw error;
  //   } finally {
  //     session.endSession();
  //   }
  // }

  async deleteRoomWithPlayers(
    roomId: string,
  ): Promise<{ deletedRoom: boolean; deletedPlayers: number }> {
    const deletePlayersResult = await this.playerModel
      .deleteMany({
        roomId: new Types.ObjectId(roomId),
      })
      .exec();

    const deleteRoomResult = await this.roomModel
      .deleteOne({
        _id: new Types.ObjectId(roomId),
      })
      .exec();

    return {
      deletedRoom: deleteRoomResult.deletedCount > 0,
      deletedPlayers: deletePlayersResult.deletedCount,
    };
  }

  // Приватный метод для преобразования в DTO
  private toResponseRoomDto(room: Room): RoomResponseDto {
    return {
      id: room._id.toString(),
      gameId: room.gameId.toString(),
      creatorId: room.creatorId.toString(),
      privacy: room.privacy,
      status: room.status,
      createdAt: room.createdAt,
    };
  }

  private toResponsePlayerDto(player: Player): PlayerResponseDto {
    return {
      id: player._id.toString(),
      roomId: player.roomId.toString(),
      userId: player.userId.toString(),
      playerActions: player.playerActions,
      playerState: player.playerState,
      createdAt: player.createdAt,
    };
  }
}
