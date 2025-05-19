import { Module } from '@nestjs/common';
import { GameplayService } from './gameplay.service';
import { GameplayGateway } from './gameplay.gateway';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  providers: [GameplayService, GameplayGateway],
})
export class GameplayModule {}
