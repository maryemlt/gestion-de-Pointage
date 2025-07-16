import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  motDePasse: string;

  @Prop({ enum: ['admin', 'employe', 'stagiaire'], default: 'employe' })
  role: string;

  @Prop()
  poste: string;

  @Prop()
  qrCode: string;

  @Prop()
  faceData: string;

  @Prop({ type: Object })
  localisationAutorisee: {
    lat: number;
    lng: number;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
