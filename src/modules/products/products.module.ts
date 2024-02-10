import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from 'src/configs/jwt.config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { getMulterConfigForImages } from 'src/configs/multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    MulterModule.registerAsync({
      useFactory: getMulterConfigForImages,
    }),
    CloudinaryModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService, ProductsModule],
})
export class ProductsModule {}
