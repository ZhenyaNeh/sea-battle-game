import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
// import { FriendshipResponseDto } from './dto/response-friendship';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // Отправить заявку в друзья
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: { _id: string; email: string },
    @Body() dto: CreateFriendshipDto,
  ) {
    return this.friendsService.create(user._id, dto.friendId);
  }

  // // Получить список друзей (можно фильтровать по статусу)
  // @Get()
  // async findAll(
  //   @Req() req: Request,
  //   @Query('status') status?: string,
  // ): Promise<FriendshipResponseDto[]> {
  //   const userId = req.user.id;
  //   return this.friendsService.findAll(userId, status);
  // }

  @Get('/info/:userId')
  @UseGuards(JwtAuthGuard)
  async getFriendInfo(
    @CurrentUser() user: { _id: string; email: string },
    @Param('userId') userId: string,
  ) {
    return await this.friendsService.getFriendById(userId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAllFriends(@CurrentUser() user: { _id: string; email: string }) {
    return await this.friendsService.getAllFriends(user._id);
  }

  @Get('/list/:userId')
  @UseGuards(JwtAuthGuard)
  async getAllUserFriends(@Param('userId') userId: string) {
    return await this.friendsService.getAllFriends(userId);
  }

  @Get('/request')
  @UseGuards(JwtAuthGuard)
  async getAllFriendRequest(
    @CurrentUser() user: { _id: string; email: string },
  ) {
    return await this.friendsService.getAllFriendRequest(user._id);
  }

  @Get('/sendrequest')
  @UseGuards(JwtAuthGuard)
  async getAllSendFriendRequest(
    @CurrentUser() user: { _id: string; email: string },
    // @Param('status') status: 'accepted' | 'pending' | 'rejected',
  ) {
    return await this.friendsService.getAllSendFriendRequest(user._id);
  }

  @Get('/friendships')
  @UseGuards(JwtAuthGuard)
  async getAllFriendShips(
    @CurrentUser() user: { _id: string; email: string },
    // @Param('status') status: 'accepted' | 'pending' | 'rejected',
  ) {
    return await this.friendsService.getAllFriendShips(user._id);
  }

  @Get('/search/:nickname')
  @UseGuards(JwtAuthGuard)
  async getSearchFriens(
    @CurrentUser() user: { _id: string; email: string },
    @Param('nickname') nickname: string,
  ) {
    return await this.friendsService.getSearchFriens(nickname, user._id);
  }

  // // Принять/отклонить заявку
  // @Patch(':friendId')
  // async update(
  //   @Req() req: Request,
  //   @Param('friendId') friendId: string,
  //   @Body() dto: UpdateFriendshipDto,
  // ): Promise<FriendshipResponseDto>
  //   const userId = req.user.id;
  //   return this.friendsService.update(userId, friendId, dto);
  // }

  // Удалить из друзей
  @Delete(':friendId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @CurrentUser() user: { _id: string; email: string },
    @Param('friendId') friendId: string,
  ) {
    await this.friendsService.remove(user._id, friendId);
    return { message: 'success' };
  }
}
