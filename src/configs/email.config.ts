import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

import { CONST } from 'src/constants';
import { IEmailConfig } from 'src/modules/email/email.interfaces';

export const getEmailConfig = (configService: ConfigService): MailerOptions => {
  const emailConfig: IEmailConfig = {
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
      user: configService.get('EMAIL_FROM') || '',
      pass: configService.get('EMAIL_SECRET') || '',
    },
  };

  if (!isValidEmailConfig(emailConfig)) {
    throw new InternalServerErrorException(CONST.Email.AUTHORIZATION_ERROR);
  }
  return {
    transport: emailConfig,
    defaults: {
      from: configService.get('EMAIL_FROM'),
    },
    preview: true,
  };
};

const isValidEmailConfig = (config: IEmailConfig): boolean => {
  return (
    !!config.host && !!config.port && !!config.auth.user && !!config.auth.pass
  );
};
