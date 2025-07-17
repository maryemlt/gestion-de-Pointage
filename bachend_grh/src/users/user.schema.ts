// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  motDePasse: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  poste?: string;

  @Prop()
  qrCode?: string;

  @Prop()
  faceData?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
