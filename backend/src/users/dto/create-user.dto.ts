// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  nickname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsNumber()
  @IsOptional()
  rating!: number;

  @IsString()
  @MinLength(8, { message: 'Password must be more then 7 symbols' })
  @MaxLength(32, { message: 'Password must be less then 33 symbols' })
  password!: string;

  @IsOptional()
  @IsString()
  role?: 'admin' | 'user';
}
