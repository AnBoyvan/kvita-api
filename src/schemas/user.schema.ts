import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { emailRegexp } from 'src/constants/user.constants';

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

  @Prop()
  discount?: number;

  @Prop()
  discountSum?: number;

  @Prop({ required: true, min: 0 })
  sum: number;
}

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    pattern: emailRegexp,
    unique: true,
  })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, default: Role.Customer })
  role: string;

  @Prop({ min: 0, default: 0 })
  discount: number;

  @Prop({ type: () => [CartItem], default: [] })
  cart: CartItem[];

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  verify: boolean;

  @Prop()
  verificationToken: string;

  @Prop({ default: null })
  passwordToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
