import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategyDto } from './dto/jwt-strategy.dto';
import { UserLoginData } from './dto/user-login.dto';
import { UserLoginDataReq } from './dto/user-login-req.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() userData: UserLoginData): Promise<UserLoginDataReq | null> {
    return this.authService.login(userData);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Request() req: { user: JwtStrategyDto },
  ): Promise<UserLoginDataReq | null> {
    return this.authService.getProfile(req.user.email);
  }
}
