import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { Picture, PictureSchema } from 'src/schemas/picture.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { getMulterConfigForImages } from 'src/configs/multer.config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from 'src/configs/jwt.config';

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
