import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { EmailModule } from './modules/email/email.module';
import { getEmailConfig } from './configs/email.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProductsModule } from './modules/products/products.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { PicturesModule } from './modules/pictures/pictures.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoConfig = await getMongoConfig(configService);
        return mongoConfig;
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: getEmailConfig,
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    EmailModule,
    ProductsModule,
    CloudinaryModule,
    PicturesModule,
    ReviewsModule,
    AdminModule,
  ],
})
export class AppModule {}
