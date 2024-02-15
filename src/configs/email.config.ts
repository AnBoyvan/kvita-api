import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getEmailConfig = (configService: ConfigService): MailerOptions => {
  return {
    transport: {
      host: 'smtp.ukr.net',
      port: 465,
      secure: true,
      auth: {
        user: configService.get('EMAIL_FROM'),
        pass: configService.get('EMAIL_SECRET'),
      },
    },
    defaults: {
      from: configService.get('EMAIL_FROM'),
    },
    preview: true,
  };
};
