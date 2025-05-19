import { Ship } from 'src/matchmaking/dto/ship.dto';
import { Hit } from './hit.dto';

export class PlayerResponseDto {
  id!: string;
  userId!: string;
  roomId!: string;
  playerActions!: Hit[];
  playerState!: Ship[];
  createdAt!: Date;
}
