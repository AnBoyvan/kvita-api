import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CONST } from 'src/constants';

export enum Role {
  Customer = 'customer',
  Partner = 'partner',
  Manager = 'manager',
  Admin = 'admin',
  Superuser = 'superuser',
  Banned = 'banned',
  Blocked = 'blocked',
}

export class CartItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productImage: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0 })
  discount?: number;

  @Prop({ default: 0 })
  discountSum?: number;

  @Prop({ required: true, min: 0, default: 0 })
  sum: number;
}

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    pattern: CONST.Regexp.EMAIL,
    unique: true,
    default: '',
  })
  email: string;

  @Prop({ unique: true, default: '' })
  phone?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.Customer })
  role: Role;

  @Prop({ min: 0, default: 0 })
  discount: number;

  @Prop({ type: () => [CartItem], default: [] })
  cart: CartItem[];

  @Prop({ default: false })
  verify: boolean;

  @Prop({ default: null })
  verificationToken: string;

  @Prop({ default: null })
  passwordToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
