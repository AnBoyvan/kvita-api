import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PictureDocument = HydratedDocument<Picture>;

@Schema({ versionKey: false, timestamps: true })
export class Picture {
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

export const PictureSchema = SchemaFactory.createForClass(Picture);
