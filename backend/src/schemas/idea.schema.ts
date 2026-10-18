import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type IdeaDocument = Idea & Document;

@Schema({ timestamps: true })
export class Idea {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['short-term', 'medium-term', 'long-term', 'anytime'], default: 'anytime' })
  timeframe: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);
