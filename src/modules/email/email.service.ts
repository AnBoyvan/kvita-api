import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { changePasswordEmail } from 'src/templates/change-password-email.template';

import { ISendEmailOptions } from './email.interfaces';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordChangeEmail(
    email: string,
    passwordToken: string,
  ): Promise<void> {
    try {
      const passwordEmail: ISendEmailOptions = changePasswordEmail(
        email,
        passwordToken,
        this.configService,
      );

      await this.mailerService.sendMail(passwordEmail);
    } catch (error) {
      throw error;
    }
  }
}
