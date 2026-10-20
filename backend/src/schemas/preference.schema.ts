import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PreferenceDocument = Preference & Document;

@Schema({ timestamps: true })
export class Preference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    enum: ['musica', 'comida', 'regalos', 'hobbies', 'detalles', 'evitar', 'otros'],
    default: 'detalles',
  })
  category: string;

  @Prop({ default: '' })
  notes: string;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);
