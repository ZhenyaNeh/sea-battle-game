import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  // Создать игру
  async create(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  // Найти все игры
  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  // Найти игру по ID
  async findOne(id: string): Promise<Game | null> {
    return this.gameModel.findById(id).exec();
  }

  // Обновить игру
  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game | null> {
    return this.gameModel
      .findByIdAndUpdate(id, updateGameDto, { new: true })
      .exec();
  }

  // Удалить игру
  async remove(id: string): Promise<Game | null> {
    return this.gameModel.findByIdAndDelete(id).exec();
  }
}
