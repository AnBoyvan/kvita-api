import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CartItem } from './user.schema';

export enum Status {
  New = 'new',
  Active = 'active',
  Completed = 'completed',
  Canceled = 'canceled',
  Rejected = 'rejected',
}

export class Customer {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  phone: string;
}

export class PaymentDetails {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  date: string;
}

export type OrderDocument = HydratedDocument<Order>;

@Schema({ versionKey: false, timestamps: true })
export class Order {
  @Prop({ required: true })
  publicId: string;

  @Prop({ type: () => [CartItem], required: true })
  items: CartItem[];

  @Prop()
  discount?: number;

  @Prop()
  discountSum?: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  customer: Customer;

  @Prop({ enum: Status, default: Status.New })
  status: string;

  @Prop({ default: '' })
  annotation?: string;

  @Prop({ default: '' })
  comment?: string;

  @Prop({ default: false })
  delivery?: boolean;

  @Prop({ default: '' })
  deliveryAddress?: string;

  @Prop({ default: false })
  paid?: boolean;

  @Prop({ type: () => [PaymentDetails] })
  paymentDetails?: PaymentDetails;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
