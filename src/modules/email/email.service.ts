import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { changePasswordEmail } from 'src/templates/change-password-email.template';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordChangeEmail(email: string, passwordToken: string) {
    const passwordEmail = changePasswordEmail(email, passwordToken);
    return await this.mailerService.sendMail(passwordEmail);
  }
}
