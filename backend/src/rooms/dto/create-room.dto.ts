// src/rooms/dto/create-room.dto.ts
import { IsEnum, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateRoomDto {
  @IsMongoId()
  @IsNotEmpty()
  gameId!: string;

  @IsEnum(['public', 'private'])
  privacy!: 'public' | 'private';
}
