import { Hit } from './shipTypes';

export interface UserData {
  nickname: string;
  email: string;
  password: string;
}

// export interface ResponseLoginUser {
//   _id?: string;
//   nickname: string;
//   email: string;
//   role: string;
//   token: string;
// }

export interface ResponseUser {
  _id?: string;
  nickname: string;
  email: string;
  role: string;
  rating: number;
  avatarUrl: string;
  createdAt: string;
}

export interface ResponseUserData {
  token: string;
  user: ResponseUser;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface ResponseLoginUser {
  _id: string;
  nickname: string;
  email: string;
  role: string;
  rating: number;
  avatarUrl: string;
  token: string;
}

export interface ResponseUpdateUser {
  _id: string;
  nickname: string;
  email: string;
  role: string;
  rating: number;
  avatarUrl: string;
}

export interface ResponseOpponent {
  nickname: string;
  rating: number;
  playerActions: Hit[];
  avatarUrl: string;
}

export interface OpponentInfo {
  nickname: string;
  rating: number;
  avatarUrl: string;
}
