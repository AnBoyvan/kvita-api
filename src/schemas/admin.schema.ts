import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ versionKey: false, timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  tags: string[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
