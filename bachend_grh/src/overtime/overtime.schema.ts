import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OvertimeDocument = Overtime & Document;

@Schema({ timestamps: true })
export class Overtime {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ required: true, default: 0 })
  hours: number; // nombre d'heures supplémentaires

  @Prop({ default: 'pending' })
  status: string; // pending | approved
}

export const OvertimeSchema = SchemaFactory.createForClass(Overtime);
