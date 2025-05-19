import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserGameInfo, UserGameInfoDocument } from './schemas/user-game-info';
import { UserGameInfoDto } from './dto/user-game-info.dto';
import { YandexDiskService } from 'src/shared/storage/yandex-disk.service';
import { MulterFile } from 'src/shared/interfaces/multerFile.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserGameInfo.name)
    private userGameInfoModel: Model<UserGameInfoDocument>,
    private yandexDiskService: YandexDiskService,
    private jwtService: JwtService,
  ) {}

  // Создание пользователя (регистрация)
  async create(createUserDto: CreateUserDto): Promise<{
    result: UserResponseDto;
    jwtToken: string;
  }> {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) {
      throw new BadRequestException('This email already exist!');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const jwtToken = this.jwtService.sign({ email: createUserDto.email });
    const result = this.toUserResponse(user);

    return { jwtToken, result };
  }

  // Поиск по email (для аутентификации)
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) return null;

    return user;
  }

  async findOneById(userId: string): Promise<UserDocument | null> {
    const user = await this.userModel
      .findById(new Types.ObjectId(userId))
      .exec();

    if (!user) return null;

    return user;
  }

  async getAll(): Promise<UserDocument[] | null> {
    return this.userModel.find().exec();
  }

  async getUserGameHistory(userId: string): Promise<UserGameInfoDto[]> {
    const history = await this.userGameInfoModel
      .find({ userId: userId })
      .exec();
    return history.map((item) => ({
      id: item._id.toString(),
      userId: item.userId.toString(),
      gameId: item.gameId.toString(),
      resultGame: item.resultGame,
      createdAt: item.createdAt,
    }));
  }

  async update(
    user: { _id: string; email: string },
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    const existUser = await this.findOneByEmail(user.email);

    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(user._id),
        { $set: updateUserDto },
        { new: true },
      )
      .exec();

    return updatedUser;
  }

  async updateRating(winnerId: string, loserId: string, health: number) {
    const [winner, loser] = await Promise.all([
      this.userModel.findById(new Types.ObjectId(winnerId)),
      this.userModel.findById(new Types.ObjectId(loserId)),
    ]);

    const winnerScore = 40;
    const loserScore = 20 + health;
    if (winner && loser) {
      const newWinnerRating = (winner.rating ? winner.rating : 0) + winnerScore;
      const newLoserRating =
        (loser.rating ? loser.rating : 0) - loserScore >= 0
          ? (loser.rating ? loser.rating : 0) - loserScore
          : 0;

      await Promise.all([
        this.userModel.updateOne(
          { _id: new Types.ObjectId(winnerId) },
          { rating: newWinnerRating },
        ),
        this.userModel.updateOne(
          { _id: new Types.ObjectId(loserId) },
          { rating: newLoserRating },
        ),
      ]);
      return { newWinnerRating, newLoserRating };
    }

    return null;
  }

  async uploadUserAvatar(
    user: { _id: string; email: string },
    file: MulterFile,
  ) {
    const existUser = await this.findOneByEmail(user.email);

    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    const avatarUrl = await this.yandexDiskService.uploadFile(user._id, file);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(user._id),
        { $set: { avatarUrl } },
        { new: true }, // Возвращаем обновленный документ
      )
      .exec();
    return updatedUser;
  }

  getUserAvatar(filename: string, res: Response) {
    return this.yandexDiskService.getPhoto(filename, res);
  }

  async searchUsersByNickname(partialNickname: string, userId: string) {
    const query = {
      _id: { $ne: new Types.ObjectId(userId) },
      nickname: {
        $regex: partialNickname,
        $options: 'i',
      },
    };

    return await this.userModel
      .find(query)
      .select('nickname email avatarUrl rating');
  }

  async getRegistrationStatsLast6Months() {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); // 6 месяцев включая текущий

    return this.userModel.aggregate<{
      month: number;
      year: number;
      count: number;
    }>([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          count: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);
  }

  async getPaginatedUsers(page: number, limit: number = 15) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find({ role: { $ne: 'admin' } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments({ role: { $ne: 'admin' } }).exec(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Преобразование в DTO (без пароля)
  private toUserResponse(user: UserDocument): UserResponseDto {
    return {
      _id: user._id.toString(),
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      rating: user.rating,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }
}
