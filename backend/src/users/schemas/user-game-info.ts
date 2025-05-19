import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserGameInfoDocument = HydratedDocument<UserGameInfo>;

@Schema({ timestamps: true })
export class UserGameInfo {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  oldRating!: number;

  @Prop({ type: Number, default: 0 })
  newRating!: number;

  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId!: Types.ObjectId;

  @Prop({ enum: ['win', 'lose', 'draw'], required: true })
  resultGame!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const UserGameInfoSchema = SchemaFactory.createForClass(UserGameInfo);
