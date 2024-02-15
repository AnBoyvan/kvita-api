import { ConfigService } from '@nestjs/config';
import { TELEGRAM_TOKEN_NOT_FOUND_ERROR } from 'src/constants/telegram.constants';
import { ITelegramOptions } from 'src/modules/telegram/telegram.interfaces';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.get('TELEGRAM_BOT_TOKEN');
  if (!token) {
    throw new Error(TELEGRAM_TOKEN_NOT_FOUND_ERROR);
  }
  return {
    token,
  };
};
