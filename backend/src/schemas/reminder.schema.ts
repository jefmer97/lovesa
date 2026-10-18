import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReminderDocument = Reminder & Document;

@Schema({ timestamps: true })
export class Reminder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  body: string;

  @Prop({ required: true })
  remindAt: Date;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: false })
  sent: boolean;

  @Prop({ default: '/timeline' })
  url: string;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
