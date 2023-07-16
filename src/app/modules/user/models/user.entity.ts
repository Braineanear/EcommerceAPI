import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, enum: Object.values(RoleTypeEnum) })
  role: RoleTypeEnum;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  passwordChangedAt?: Date;

  @Prop({ type: String })
  address?: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String })
  website?: string;

  @Prop({ type: String })
  company?: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: Types.ObjectId, ref: 'Image', autopopulate: true })
  avatar: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
