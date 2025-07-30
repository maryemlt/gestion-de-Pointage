import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeaveDocument = Leave & Document;

@Schema({ timestamps: true })
export class Leave {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  type: string; // 'congé', 'maladie', 'absence'

  @Prop({ required: true })
  startDate: string; // YYYY-MM-DD

  @Prop({ required: true })
  endDate: string; // YYYY-MM-DD

  @Prop({ default: 'pending' })
  status: string; // 'pending' | 'approved' | 'rejected'

  @Prop()
  reason: string;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
