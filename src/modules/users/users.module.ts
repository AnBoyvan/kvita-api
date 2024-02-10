import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/configs/jwt.config';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
