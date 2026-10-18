import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: false })
  isAllDay: boolean;

  @Prop()
  notes: string;

  @Prop({ type: [String], default: [] })
  media: string[];

  @Prop({ type: Types.ObjectId, ref: 'Idea' })
  ideaId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
