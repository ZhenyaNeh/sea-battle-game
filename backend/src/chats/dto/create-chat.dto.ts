import { IsMongoId } from 'class-validator';

export class CreateChatDto {
  @IsMongoId()
  roomId!: string; // ID комнаты, к которой привязан чат
}
