import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Ship } from 'src/matchmaking/dto/ship.dto';
import { Hit } from '../dto/hit.dto';

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ _id: true })
export class Player extends Document {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId!: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  currentRating!: number;

  @Prop({ type: Number, default: 0 })
  matchScore!: number;

  @Prop({ type: Object, default: [] }) // { moves: [{ x: number, y: number, hit: boolean }] }
  playerActions!: Hit[];

  @Prop({ type: Object, default: [] })
  playerState!: Ship[];

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
