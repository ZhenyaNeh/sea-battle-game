import { IsMongoId, IsNotEmpty } from 'class-validator';

// src/rooms/dto/join-room.dto.ts
export class JoinRoomDto {
  @IsMongoId()
  @IsNotEmpty()
  roomId!: string;
}
