import { ConfigService } from '@nestjs/config';

export const changePasswordEmail = (
  email: string,
  passwordToken: string,
): object => {
  const configService = new ConfigService();
  return {
    to: email,
    from: configService.get('EMAIL_FROM'),
    subject: 'Change password',
    html: `<a target="_blank" href="${configService.get('FRONTEND_URL')}/password/${passwordToken}">Для зміни пароля перейдіть за посиланням</a>`,
  };
};
