import { instance } from '@/api/auth.api';
import { ResponseUpdateUser } from '../types/apiTypes';
import { FriendShipData, FriendsInfo } from '../types/friendTypes';
import {
  GameTypeStatsResponse,
  RegistrationStatsResponse,
  StatsRatingResponse,
  StatsResponse,
} from '../types/roomTypes';
import { LocalStorageManager } from '../localstorage';
import { PaginateInfo, UsersPaginateInfo } from '../types/playerTypes';
import { GameHistory, PaginateUnfinishedGame } from '../types/gameTypes';

export const eventTokenInstance = new LocalStorageManager('event-token');

export const UserService = {
  async updateProfileInfo(updateData: {
    nickname: string;
  }): Promise<ResponseUpdateUser | undefined> {
    const { data } = await instance.patch<ResponseUpdateUser>(
      '/users',
      updateData,
    );
    return data;
  },
  async updateProfilePhoto(
    formData: FormData,
  ): Promise<ResponseUpdateUser | undefined> {
    const { data } = await instance.post<ResponseUpdateUser>(
      '/users/avatar/upload',
      formData,
    );
    return data;
  },
  getProfilePhoto(filePath: string) {
    const fileNme = filePath.replace('https://webdav.yandex.ru/avatars/', '');
    return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/users/avatar/${fileNme}?t=${1}`;
    // return `http://192.168.1.103:5000/users/avatar/${fileNme}?t=1}`;
  },
  async getInviteUserInfo(userId: string) {
    const { data } = await instance.get<FriendsInfo>(`/friends/info/${userId}`);
    return data;
  },
  async getAllFriends() {
    const { data } = await instance.get<FriendsInfo[]>('/friends');
    return data;
  },
  async getAllUserFriends(userId: string) {
    const { data } = await instance.get<FriendsInfo[]>(
      `/friends/list/${userId}`,
    );
    return data;
  },
  async getAllFriendShips() {
    const { data } = await instance.get<FriendShipData[]>(
      '/friends/friendships',
    );
    return data;
  },
  async getAllFriendsRequest() {
    const { data } = await instance.get<FriendsInfo[]>('/friends/request');
    return data;
  },
  async getAllSendFriendsRequest() {
    const { data } = await instance.get<FriendsInfo[]>('/friends/sendrequest');
    return data;
  },
  async getFriendsSearch(nickname: string) {
    const { data } = await instance.get<FriendsInfo[]>(
      `/friends/search/${nickname}`,
    );
    return data;
  },
  async deleteFriend(friendId: string) {
    const { data } = await instance.delete<{ message: string }>(
      `/friends/${friendId}`,
    );
    return data;
  },
  async getCountGames() {
    const { data } = await instance.get<{
      allGames: number;
      winnerGames: number;
      loseGames: number;
    }>('/rooms/countGames');
    return data;
  },
  async getCountUserGames(userId: string) {
    //////////////////////////////////////////////////////////////////////////////////
    const { data } = await instance.get<{
      allGames: number;
      winnerGames: number;
      loseGames: number;
    }>(`/rooms/countGames/${userId}`);
    return data;
  },
  async getRatingHistory() {
    const { data } = await instance.get<{
      allGames: number;
      winnerGames: number;
      loseGames: number;
    }>('/rooms/ratingHistory');
    return data;
  },
  async getMonthlyWinLoss() {
    const { data } = await instance.get<StatsResponse[]>(
      '/rooms/monthly-win-loss',
    );
    return data;
  },
  async getMonthlyUserWinLoss(userId: string) {
    //////////////////////////////////////////////////////////////////////////////////////
    const { data } = await instance.get<StatsResponse[]>(
      `/rooms/monthly-win-loss/${userId}`,
    );
    return data;
  },
  async getMonthlyAverageRatings() {
    const { data } = await instance.get<StatsRatingResponse[]>(
      '/rooms/monthly-average-ratings',
    );
    return data;
  },
  async getMonthlyUserAverageRatings(userId: string) {
    //////////////////////////////////////////////////////////////////////////////////////////
    const { data } = await instance.get<StatsRatingResponse[]>(
      `/rooms/monthly-average-ratings/${userId}`,
    );
    return data;
  },
  async getRegistrationStatsLast6Months() {
    const { data } = await instance.get<RegistrationStatsResponse[]>(
      '/users/stats/registration-last-6-months',
    );
    return data;
  },
  async getCompletedGamesStatsLast6Months() {
    const { data } = await instance.get<RegistrationStatsResponse[]>(
      '/rooms/stats/completed-games-last-6-months',
    );
    return data;
  },
  async getWinLossStatsLast6Months() {
    const { data } = await instance.get<StatsResponse[]>(
      '/rooms/stats/win-loss-last-6-months',
    );
    return data;
  },
  async getGameTypeStatsLast6Months() {
    const { data } = await instance.get<GameTypeStatsResponse[]>(
      '/rooms/stats/game-types-last-6-months',
    );
    return data;
  },
  async getPaginatedUsers(page: number, limit: number) {
    const { data } = await instance.get<PaginateInfo>(
      `/users/stats/paginated?page=${page}&limit=${limit}`,
    );
    return data;
  },
  async getPaginatedUsersInfo(userId: string) {
    const { data } = await instance.get<UsersPaginateInfo>(
      `users/user-info/${userId}`,
    );
    return data;
  },
  async getPaginatedUnfinishedGame(page: number, limit: number) {
    const { data } = await instance.get<PaginateUnfinishedGame>(
      `/rooms/stats/unfinished-game?page=${page}&limit=${limit}`,
    );
    return data;
  },
  async getGameHistory() {
    const { data } = await instance.get<GameHistory[]>(
      '/rooms/stats/last-3-game',
    );
    return data;
  },
  async getUserGameHistory(userId: string) {
    const { data } = await instance.get<GameHistory[]>(
      `/rooms/stats/last-3-game/${userId}`,
    );
    return data;
  },
};
