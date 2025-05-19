import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Game extends Document {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  nameOfTheGame!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, default: 2 })
  minPlayers!: number;

  @Prop({ required: true, default: 2 })
  maxPlayers!: number;

  @Prop({ type: Object, required: true })
  rules!: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
