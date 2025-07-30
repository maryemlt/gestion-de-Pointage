import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop()
  checkIn: string; // HH:mm

  @Prop()
  checkOut: string; // HH:mm

  @Prop({ default: 0 })
  hoursWorked: number; // en heures
}

// ✅ Très important : exporter le schema
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
