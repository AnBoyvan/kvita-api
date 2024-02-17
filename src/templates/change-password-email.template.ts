import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CONST } from 'src/constants';
import { ISendEmailOptions } from 'src/modules/email/email.interfaces';

export const changePasswordEmail = (
  email: string,
  passwordToken: string,
  configService: ConfigService,
): ISendEmailOptions => {
  const emailFrom = configService.get('EMAIL_FROM') || '';
  if (!emailFrom) {
    throw new InternalServerErrorException(CONST.Email.AUTHORIZATION_ERROR);
  }

  const frontendUrl = configService.get('FRONTEND_URL');
  if (!frontendUrl) {
    throw new InternalServerErrorException(CONST.Email.AUTHORIZATION_ERROR);
  }

  return {
    to: email,
    from: emailFrom,
    subject: 'Change password',
    html: `<a target="_blank" href="${frontendUrl}/password/${passwordToken}">Для зміни пароля перейдіть за посиланням</a>`,
  };
};
