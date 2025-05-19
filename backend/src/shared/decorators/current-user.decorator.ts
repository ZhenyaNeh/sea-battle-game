// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';

// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest<Request>();
//     return request.user; // Или request.user?._id, в зависимости от того, как хранится ID пользователя
//   },
// );

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtStrategyDto } from 'src/auth/dto/jwt-strategy.dto';
// import { JwtStrategyDto } from '../../auth/dto/jwt-strategy.dto'; // Путь к вашему DTO

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtStrategyDto => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtStrategyDto }>();
    return request.user; // Возвращает user из JWT-токена
  },
);
