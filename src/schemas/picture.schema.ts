import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PictureDocument = HydratedDocument<Picture>;

@Schema({ versionKey: false, timestamps: true })
export class Picture {
  @Prop({ required: true })
  imageURL: string;

  @Prop({ required: true })
  largeImageURL: string;

  @Prop({ default: '' })
  title?: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ default: [] })
  tags?: string[];
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
