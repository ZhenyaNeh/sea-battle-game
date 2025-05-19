import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'src/shared/interfaces/multerFile.interface';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { EmailUserDto } from './dto/user-email.dto';

@Controller('users')
@SetMetadata('cors', {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Accept, Authorization',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<{
    result: UserResponseDto;
    jwtToken: string;
  }> {
    return this.usersService.create(createUserDto);
  }

  @Get('user-info/:userId')
  @UsePipes(new ValidationPipe())
  async findOneById(@Param('userId') userId: string) {
    return this.usersService.findOneById(userId);
  }

  @Get(':id/game-history')
  async getGameHistory(@Param('id') id: string) {
    return this.usersService.getUserGameHistory(id);
  }

  @Post('avatar/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @CurrentUser() user: { _id: string; email: string },
    @UploadedFile() file: MulterFile,
  ) {
    return this.usersService.uploadUserAvatar(user, file);
  }

  @Get('avatar/:filename')
  // @UseGuards(JwtAuthGuard)
  getAvatar(@Param('filename') filename: string, @Res() res: Response) {
    return this.usersService.getUserAvatar(filename, res);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @CurrentUser() user: { _id: string; email: string },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user, updateUserDto);
  }

  @Get('stats/paginated')
  @UseGuards(JwtAuthGuard)
  async getPaginatedUsers(@Query('page') page = 1, @Query('limit') limit = 15) {
    const res = await this.usersService.getPaginatedUsers(+page, +limit);
    return res;
  }

  @Get('stats/registration-last-6-months')
  @UseGuards(JwtAuthGuard)
  async getRegistrationStats() {
    const stats = await this.usersService.getRegistrationStatsLast6Months();
    return stats;
  }

  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<void> {
  //   return this.usersService.delete(id);
  // }
}
