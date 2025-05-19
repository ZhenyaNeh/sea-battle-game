import { IsMongoId } from 'class-validator';

export class SearchGameDto {
  @IsMongoId()
  gameId!: string; // ID игры из MongoDB
}
