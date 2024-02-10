import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ versionKey: false, timestamps: true })
export class Review {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ required: true })
  comment: string;

  @Prop()
  date?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
