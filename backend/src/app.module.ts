import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { GamesModule } from './games/games.module';
import { RoomsModule } from './rooms/rooms.module';
import { GameplayModule } from './gameplay/gameplay.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { ChatsModule } from './chats/chats.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { StorageModule } from './shared/storage/storage.module';
import { GlobalrequestModule } from './globalrequest/globalrequest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    // подключаем mongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    StorageModule,
    AuthModule,
    FriendsModule,
    GamesModule,
    RoomsModule,
    GameplayModule,
    MatchmakingModule,
    ChatsModule,
    UsersModule,
    SharedModule,
    GlobalrequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
