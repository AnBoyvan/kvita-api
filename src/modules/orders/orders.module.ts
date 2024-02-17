import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TelegramModule } from 'src/modules/telegram/telegram.module';
import { Order, OrderSchema } from 'src/schemas/order.schema';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    TelegramModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
