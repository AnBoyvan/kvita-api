import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Telegraf } from 'telegraf';

import { CONST } from 'src/constants';
import { OrderDocument } from 'src/schemas/order.schema';
import { coffeeWithCinnamonMessage } from 'src/templates/coffe-with-cinnamon-messages.template';
import { newOrderMessage } from 'src/templates/new-order-message';

import { ITelegramOptions } from './telegram.interfaces';

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf;
  private readonly chats = {
    orders: this.configService.get('TELEGRAM_ORDERS_CHAT_ID'),
    coffeeWithCinnamon: this.configService.get(
      'TELEGRAM_COFFEE_WITH_CINNAMON_CHAT_ID',
    ),
  };

  constructor(
    @Inject(CONST.Telegram.MODULE_OPTIONS) options: ITelegramOptions,
    private readonly configService: ConfigService,
  ) {
    this.bot = new Telegraf(options.token);
  }

  async sendNewOrder(order: OrderDocument): Promise<void> {
    const parse_mode = 'HTML';

    const message = newOrderMessage(order);

    await this.bot.telegram.sendMessage(this.chats.orders, message, {
      parse_mode,
    });
  }

  @Cron('0 00 07 * * THU', { timeZone: 'Europe/Kiev' })
  async sendCoffeeWithCinnamonMessage(): Promise<void> {
    const message = coffeeWithCinnamonMessage();
    await this.bot.telegram.sendMessage(this.chats.coffeeWithCinnamon, message);
  }
}
