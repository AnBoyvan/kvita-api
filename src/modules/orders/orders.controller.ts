import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return await this.ordersService.create(dto);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get()
  async getOrders(@Query() dto: FindOrdersDto) {
    return await this.ordersService.findOrders(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('own')
  async getOwn(@CurrentUser('_id') _id: Types.ObjectId) {
    return await this.ordersService.findCustomerOrders(_id);
  }

  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.ordersService.findById(id);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return await this.ordersService.remove(id);
  }
}
