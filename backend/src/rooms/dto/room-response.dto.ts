// src/rooms/dto/room-response.dto.ts
export class RoomResponseDto {
  id!: string;
  gameId!: string;
  creatorId!: string;
  privacy!: string;
  status!: string;
  createdAt!: Date;
}
