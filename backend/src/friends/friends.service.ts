import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Friendship } from './schemas/friendship.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
// import { CreateFriendshipDto } from './dto/create-friendship.dto';
// import { UpdateFriendshipDto } from './dto/update-friendship.dto';
// import { FriendshipResponseDto } from './dto/response-friendship';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<Friendship>,
    private usersService: UsersService,
  ) {}

  // Отправить заявку в друзья
  async create(userId: string, friendId: string) {
    const userIdObj = new Types.ObjectId(userId);
    const friendIdObj = new Types.ObjectId(friendId);

    const existing = await this.friendshipModel.findOne({
      $or: [
        { userId: userIdObj, friendId: friendIdObj },
        { userId: friendIdObj, friendId: userIdObj },
      ],
    });

    if (existing && existing.status !== 'accepted') {
      existing.status = 'pending';
      existing.markModified('status');
      existing.save();
      return existing;
    }

    return await this.friendshipModel.create({
      userId: userIdObj,
      friendId: friendIdObj,
      status: 'pending',
    });
  }

  async getFriendById(userId: string) {
    return await this.usersService.findOneById(userId);
  }

  // Получить список друзей (принятые/отклоненные заявки)
  async getAllFriends(userId: string) {
    const userIdObj = new Types.ObjectId(userId);

    const friendships = await this.friendshipModel
      .find({
        $or: [{ userId: userIdObj }, { friendId: userIdObj }],
        status: 'accepted',
      })
      .populate('userId', '_id nickname email avatarUrl rating')
      .populate('friendId', '_id nickname email avatarUrl rating')
      .lean();

    const friends = friendships.map((friendship) => {
      // Определяем, кто из пары является другом (не текущим пользователем)
      const isUserInitiator = friendship.userId._id.equals(userIdObj);
      return isUserInitiator ? friendship.friendId : friendship.userId;
    });

    // Удаляем дубликаты (на случай, если они есть)
    const uniqueFriends = Array.from(
      new Map(
        friends.map((friend) => [friend._id.toString(), friend]),
      ).values(),
    );

    return uniqueFriends;
  }

  async getAllFriendShips(userId: string) {
    const userIdObj = new Types.ObjectId(userId);

    const friendships = await this.friendshipModel.find({
      $or: [{ userId: userIdObj }, { friendId: userIdObj }],
      // status: 'accepted',
    });

    return friendships;
  }

  async getAllFriendRequest(userId: string) {
    const userIdObj = new Types.ObjectId(userId);

    const friendships = await this.friendshipModel
      .find({
        friendId: userIdObj,
        status: 'pending',
        // userId: userId,
      })
      .populate('userId', '_id nickname email avatarUrl rating')
      .lean();

    const result = friendships.map((friendship) => ({
      ...friendship.userId,
    }));

    return result;
  }

  async getAllSendFriendRequest(userId: string) {
    const userIdObj = new Types.ObjectId(userId);

    const friendships = await this.friendshipModel
      .find({
        userId: userIdObj,
        status: 'pending',
      })
      .populate('userId', '_id nickname email avatarUrl rating')
      .lean();

    const result = friendships.map((friendship) => ({
      ...friendship.userId,
    }));

    return result;
  }

  async getSearchFriens(partialNickname: string, userId: string) {
    const users = await this.usersService.searchUsersByNickname(
      partialNickname,
      userId,
    );

    return users;
  }

  // Обновить статус заявки (принять/отклонить)
  async update(
    userId: string,
    friendId: string,
    status: 'accepted' | 'rejected',
  ) {
    const userIdObj = new Types.ObjectId(userId);
    const friendIdObj = new Types.ObjectId(friendId);

    const friendship = await this.friendshipModel.findOne({
      userId: friendIdObj,
      friendId: userIdObj,
      status: 'pending',
    });

    if (!friendship) {
      // throw new Error('The application does not exist');

      return null;
    }

    friendship.status = status;
    friendship.markModified('status');
    friendship.save();
    return friendship;
  }

  // Удалить из друзей
  async remove(userId: string, friendId: string) {
    const userIdObj = new Types.ObjectId(userId);
    const friendIdObj = new Types.ObjectId(friendId);

    return await this.friendshipModel.deleteOne({
      $or: [
        { userId: userIdObj, friendId: friendIdObj },
        { userId: friendIdObj, friendId: userIdObj },
      ],
    });
  }
}
