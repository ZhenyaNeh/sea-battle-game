import { Module } from '@nestjs/common';
import { GlobalrequestService } from './globalrequest.service';
import { FriendsModule } from 'src/friends/friends.module';
import { GlobalrequestGateway } from './globalrequest.gateway';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [FriendsModule, RoomsModule],
  providers: [GlobalrequestService, GlobalrequestGateway],
})
export class GlobalrequestModule {}
