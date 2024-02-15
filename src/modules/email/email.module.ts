import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
