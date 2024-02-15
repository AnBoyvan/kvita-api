import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './telegram.interfaces';
import { TELEGRAM_MODULE_OPTIONS } from 'src/constants/telegram.constants';
import { ConfigService } from '@nestjs/config';
import { newOrderMessage } from 'src/templates/new-order-message';
import { OrderDocument } from 'src/schemas/order.schema';
import { Cron } from '@nestjs/schedule';
import { coffeeWithCinnamonMessage } from 'src/templates/coffe-with-cinnamon-messages.template';

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
    @Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions,
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
