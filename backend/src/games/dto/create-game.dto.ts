// src/games/dto/create-game.dto.ts
import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateGameDto {
  @IsString()
  nameOfTheGame!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @IsOptional()
  minPlayers!: number;

  @IsNumber()
  @IsOptional()
  maxPlayers!: number;

  @IsObject()
  rules!: Record<string, any>;
}
