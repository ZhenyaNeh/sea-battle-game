import { instance } from '@/api/auth.api';
import { PlayerResponse } from '../types/playerTypes';
import { ResponseOpponent } from '../types/apiTypes';
import { Ship } from '../types/shipTypes';
import { DeleteUnfinishedGameType } from '../types/roomTypes';

export const RoomService = {
  // async updateProfileInfo(updateData: {
  //   nickname: string;
  // }): Promise<ResponseUpdateUser | undefined> {
  //   const { data } = await instance.patch<ResponseUpdateUser>(
  //     'users',
  //     updateData,
  //   );
  //   return data;
  // },
  async getPlayer(roomId: string): Promise<PlayerResponse | undefined> {
    const { data } = await instance.get<PlayerResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/rooms/player/${roomId}`,
    );
    return data;
  },
  async getOpponentPlayer(
    roomId: string,
  ): Promise<ResponseOpponent | undefined> {
    const { data } = await instance.get<ResponseOpponent>(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/rooms/opponentPlayer/${roomId}`,
    );
    return data;
  },
  async isCurrentUserTurn(
    roomId: string,
  ): Promise<{ isCreatorTurn: boolean } | undefined> {
    const { data } = await instance.get<{ isCreatorTurn: boolean }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/rooms/player/checkTurn/${roomId}`,
    );
    return data;
  },
  async gameOver(roomId: string) {
    const { data } = await instance.get<{
      status: string;
      winner: string;
      liveShips: number;
      opponentShips: Ship[];
      userScore: number;
      opponentScore: number;
    }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/rooms/gameOver/${roomId}`,
    );
    return data;
  },
  async getCurrentGameId(
    roomId: string,
  ): Promise<{ gameId: string } | undefined> {
    const { data } = await instance.get<{ gameId: string }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/rooms/getGameId/${roomId}`,
    );
    return data;
  },
  async deleteRoomWithPlayers(roomId: string) {
    const { data } = await instance.delete<DeleteUnfinishedGameType>(
      `/rooms/unfinished-game/${roomId}`,
    );
    return data;
  },
};
