import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ default: null })
  checkIn: string;

  @Prop({ default: null })
  checkOut: string;

  @Prop({ default: 0 })
  hoursWorked: number;

  @Prop({ required: true })
  status: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
