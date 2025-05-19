// src/users/dto/user-response.dto.ts
export class UserResponseDto {
  _id!: string;
  nickname!: string;
  email!: string;
  role!: string;
  rating!: number;
  avatarUrl!: string;
  createdAt!: Date;
}
