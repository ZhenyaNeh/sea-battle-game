import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { SharedModule } from 'src/shared/shared.module';
import { BullModule } from '@nestjs/bull';
import { MatchmakingGateway } from './matchmaking.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'matchmaking',
      redis: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: false, // Не удалять завершенные задания
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 100000,
        },
      },
    }),
    RoomsModule,
    SharedModule,
    UsersModule,
  ],
  controllers: [],
  providers: [MatchmakingService, MatchmakingGateway],
})
export class MatchmakingModule {}
