import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CONST } from 'src/constants';
import {
  ITelegramOptions,
  TelegramConfig,
} from 'src/modules/telegram/telegram.interfaces';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const telegramConfig: TelegramConfig = {
    token: configService.get('TELEGRAM_BOT_TOKEN') || '',
  };

  if (!isValidTelegramConfig(telegramConfig)) {
    throw new InternalServerErrorException(
      CONST.Telegram.TOKEN_NOT_FOUND_ERROR,
    );
  }

  return telegramConfig;
};

const isValidTelegramConfig = (config: TelegramConfig): boolean => {
  return !!config.token;
};
