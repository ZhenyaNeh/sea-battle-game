export interface RoomResponse {
  id: string;
  gameId: string;
  creatorId: string;
  privacy: string;
  status: string;
  createdAt: Date;
}

export interface StatsResponse {
  month: number;
  year: number;
  wins: number;
  losses: number;
}

export interface StatsData {
  month: string;
  year: number;
  wins: number;
  losses: number;
}

export interface StatsRatingResponse {
  month: number;
  averageRating: number;
}

export interface StatsRatingData {
  month: string;
  averageRating: number;
}

export interface RegistrationStatsResponse {
  month: number;
  year: number;
  count: number;
}

export interface RegistrationStatsData {
  month: string;
  year: number;
  count: number;
}

export interface GameTypeStatsResponse {
  month: number;
  year: number;
  classicCount: number;
  eventCount: number;
}

export interface GameTypeStatsData {
  month: string;
  year: number;
  classicCount: number;
  eventCount: number;
}

export interface DeleteUnfinishedGameType {
  deletedRoom: number;
  deletedPlayers: number;
}
