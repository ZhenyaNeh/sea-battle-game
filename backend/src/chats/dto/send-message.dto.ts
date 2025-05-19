import { IsMongoId, IsString, IsBoolean, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsMongoId()
  chatId!: string; // ID чата

  @IsString()
  content!: string; // Текст сообщения

  @IsBoolean()
  @IsOptional()
  isGameEvent!: boolean; // Является ли событием игры
}
