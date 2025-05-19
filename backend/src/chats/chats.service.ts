import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  // Создать чат для комнаты
  async createChat(createChatDto: CreateChatDto): Promise<ChatDocument> {
    const chat = new this.chatModel(createChatDto);
    return chat.save();
  }

  // Отправить сообщение
  async sendMessage(sendMessageDto: SendMessageDto): Promise<MessageDocument> {
    const message = new this.messageModel(sendMessageDto);
    return message.save();
  }

  // Получить историю сообщений чата
  async getMessages(chatId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ chatId: chatId })
      .sort({ nickname: 1 })
      .exec();
  }

  // Удалить чат (если комната закрыта)
  async deleteChat(chatId: string): Promise<void> {
    await this.chatModel.deleteOne({ _id: chatId }).exec();
    await this.messageModel.deleteMany({ chatId: chatId }).exec();
  }
}
