import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('gameOver/:roomId')
  async getGameOver(
    @CurrentUser() user: { _id: string; email: string },
    @Param('roomId') roomId: string,
  ) {
    return await this.roomsService.isGameOver(user._id, roomId);
  }

  @Get('/countGames')
  async getCountGames(@CurrentUser() user: { _id: string; email: string }) {
    return await this.roomsService.getCountGames(user._id);
  }

  @Get('/countGames/:userId')
  async getUserCountGames(@Param('userId') userId: string) {
    return await this.roomsService.getCountGames(userId);
  }

  @Get('/ratingHistory')
  async getRatingHistory(@CurrentUser() user: { _id: string; email: string }) {
    return await this.roomsService.getRatingHistory(user._id);
  }

  @Get('/monthly-win-loss')
  async getMonthlyWinLoss(@CurrentUser() user: { _id: string; email: string }) {
    return await this.roomsService.getMonthlyWinLoss(user._id);
  }
  @Get('/monthly-win-loss/:userId')
  async getMonthlyUserWinLoss(@Param('userId') userId: string) {
    return await this.roomsService.getMonthlyWinLoss(userId);
  }

  @Get('/monthly-average-ratings')
  async getMonthlyAverageRatings(
    @CurrentUser() user: { _id: string; email: string },
  ) {
    return await this.roomsService.getMonthlyAverageRatings(user._id);
  }
  @Get('/monthly-average-ratings/:userId')
  async getMonthlyUserAverageRatings(@Param('userId') userId: string) {
    return await this.roomsService.getMonthlyAverageRatings(userId);
  }

  @Get('opponentPlayer/:roomId')
  async getOpponentPlayerInRoom(
    @CurrentUser() user: { _id: string; email: string },
    @Param('roomId') roomId: string,
  ) {
    return await this.roomsService.getOpponentPlayerInRoom(user._id, roomId);
  }

  @Get('player/:roomId')
  async getPlayerInRoom(
    @CurrentUser() user: { _id: string; email: string },
    @Param('roomId') roomId: string,
  ) {
    return await this.roomsService.getPlayerInRoom(user._id, roomId);
  }

  @Get('getGameId/:roomId')
  async getGameId(@Param('roomId') roomId: string) {
    return await this.roomsService.getGameID(roomId);
  }

  @Get('player/checkTurn/:roomId')
  async isCurrentUserTurn(
    @CurrentUser() user: { _id: string; email: string },
    @Param('roomId') roomId: string,
  ) {
    return await this.roomsService.isCurrentUserTurn(user._id, roomId);
  }

  @Get('stats/completed-games-last-6-months')
  async getCompletedGamesStats() {
    const stats = await this.roomsService.getCompletedGamesStatsLast6Months();
    return stats;
  }

  @Get('stats/win-loss-last-6-months')
  async getWinLossStats() {
    const stats = await this.roomsService.getWinLossStatsLast6Months();
    return stats;
  }

  @Get('stats/game-types-last-6-months')
  async getGameTypeStats() {
    const stats = await this.roomsService.getGameTypeStatsLast6Months();
    return stats;
  }

  @Get('stats/last-3-game')
  async getLastThreeGames(@CurrentUser() user: { _id: string; email: string }) {
    const stats = await this.roomsService.getLastThreeGames(user._id);
    return stats;
  }

  @Get('stats/last-3-game/:userId')
  async getLastUserThreeGames(@Param('userId') userId: string) {
    const stats = await this.roomsService.getLastThreeGames(userId);
    return stats;
  }

  @Get('stats/unfinished-game')
  async getAllUnfinishedGame(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const stats = await this.roomsService.getAllUnfinishedGame(page, limit);
    return stats;
  }

  @Delete('unfinished-game/:roomId')
  async deleteRoomWithPlayers(@Param('roomId') roomId: string) {
    const stats = await this.roomsService.deleteRoomWithPlayers(roomId);
    return stats;
  }

  // @Get('stats/paginated')
  // @UseGuards(JwtAuthGuard)
  // async getPaginatedUsers(@Query('page') page = 1, @Query('limit') limit = 15) {
  //   const res = await this.usersService.getPaginatedUsers(+page, +limit);
  //   return res;
  // }
}
