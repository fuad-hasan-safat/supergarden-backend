import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;
  
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
