import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SupportedLanguages } from 'src/constants';
import { AppRoles } from '../interfaces/users.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret, options) => {
      delete ret.password;
      delete ret.__v;
    },
  },
})
export class User {
  @Prop({ type: String, required: true, index: 1 })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: [AppRoles.USER, AppRoles.SUPER_ADMIN],
    default: AppRoles.USER,
  })
  role: AppRoles;

  @Prop({
    type: String,
    enum: Object.values(SupportedLanguages),
    default: SupportedLanguages.EN,
  })
  language: SupportedLanguages;
}

export const UserSchema = SchemaFactory.createForClass(User);
