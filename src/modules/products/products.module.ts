import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { getMulterConfigForImages } from 'src/configs/multer.config';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';
import { Product, ProductSchema } from 'src/schemas/product.schema';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MulterModule.registerAsync({
      useFactory: getMulterConfigForImages,
    }),
    CloudinaryModule,
    UsersModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService, ProductsModule],
})
export class ProductsModule {}
