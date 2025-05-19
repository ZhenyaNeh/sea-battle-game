import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserLoginData } from './dto/user-login.dto';
import { UserLoginDataReq } from './dto/user-login-req.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return this.toUserResponse(user);
    }
    throw new BadRequestException('User or passwor are incorrect');
  }

  async login(user: UserLoginData): Promise<UserLoginDataReq | null> {
    const userInfoReq = await this.usersService.findOneByEmail(user.email);
    if (userInfoReq) {
      const { _id, email, nickname, role, rating, avatarUrl } = userInfoReq;
      const payload = { _id, email };
      return {
        _id: _id.toString(),
        nickname,
        email,
        role,
        rating,
        avatarUrl,
        token: this.jwtService.sign(payload),
      };
    }

    return null;
  }

  async getProfile(email: string): Promise<UserLoginDataReq | null> {
    const userInfoReq = await this.usersService.findOneByEmail(email);
    if (userInfoReq) {
      const { _id, email, nickname, role, rating, avatarUrl } = userInfoReq;
      const payload = { _id, email };
      return {
        _id: _id.toString(),
        nickname,
        email,
        role,
        rating,
        avatarUrl,
        token: this.jwtService.sign(payload),
      };
    }

    return null;
  }

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
