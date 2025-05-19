import { Hit, Ship } from './shipTypes';

export interface PlayerResponse {
  id: string;
  userId: string;
  roomId: string;
  currentRating: number;
  playerActions: Hit[];
  playerState: Ship[];
  createdAt: Date;
}

export interface UsersPaginateInfo {
  _id: string;
  nickname: string;
  email: string;
  avatarUrl: string;
  rating: number;
}

export interface MetaPaginateInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginateInfo {
  data: UsersPaginateInfo[];
  meta: MetaPaginateInfo;
}
