// src/games/dto/game-response.dto.ts
export class GameResponseDto {
  id!: string;
  nameOfTheGame!: string;
  description!: string;
  minPlayers!: number;
  maxPlayers!: number;
  rules!: Record<string, any>;
  createdAt!: Date;
}
