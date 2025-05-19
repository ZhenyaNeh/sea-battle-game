import { MetaPaginateInfo } from './playerTypes';

export type CellState = 'hit' | 'miss' | 'ship' | null;
export type OpponentCellState = 'hit' | 'miss' | null;

export interface GameState {
  board: CellState[][];
  opponentBoard: OpponentCellState[][];
  currentTurn: boolean;
  gameOver: boolean;
  winner: string;
}

export interface GameHistory {
  roomId: string;
  winner: string;
  gameId: string;
  matchScore: number;
}

export interface UnfinishedGame {
  roomId: string;
  status: string;
  minutesAgo: number;
}

export interface PaginateUnfinishedGame {
  data: UnfinishedGame[];
  meta: MetaPaginateInfo;
}
