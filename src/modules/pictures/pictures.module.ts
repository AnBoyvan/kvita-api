import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { getJWTConfig } from 'src/configs/jwt.config';
import { getMulterConfigForImages } from 'src/configs/multer.config';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';
import { Picture, PictureSchema } from 'src/schemas/picture.schema';

import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Picture.name, schema: PictureSchema }]),
    MulterModule.registerAsync({
      useFactory: getMulterConfigForImages,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    CloudinaryModule,
  ],
  providers: [PicturesService],
  controllers: [PicturesController],
})
export class PicturesModule {}
