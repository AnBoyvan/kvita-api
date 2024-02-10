import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Category {
  Classic = 'classic',
  Cheesecake = 'cheesecake',
  Dessert = 'dessert',
  Set = 'set',
  Other = 'other',
}

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false, timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discount?: number;

  @Prop()
  discountPrice?: number;

  @Prop({ default: '' })
  description?: string;

  @Prop({ enum: Category, default: Category.Other })
  category: string;

  @Prop({ default: '' })
  imageURL?: string;

  @Prop({ type: [String], default: [] })
  imageGallery?: string[];

  @Prop({ default: null })
  calories?: number;

  @Prop({ default: null })
  proteins?: number;

  @Prop({ default: null })
  fats?: number;

  @Prop({ default: null })
  carbohydrates?: number;

  @Prop({ type: [String], default: [] })
  favorite?: string[];

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: Boolean, default: true })
  isNewProduct?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
