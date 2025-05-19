import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creatorId!: Types.ObjectId;

  @Prop({ default: true })
  isCreatorTurn!: boolean;

  @Prop({ type: String, default: '' })
  winner!: string;

  @Prop({ type: String, enum: ['public', 'private'], default: 'public' })
  privacy!: string;

  @Prop({
    type: String,
    enum: ['waiting', 'in_progress', 'completed'],
    default: 'waiting',
  })
  status!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
