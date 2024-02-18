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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UserDocument } from 'src/schemas/user.schema';

import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Створення замовлення' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return await this.ordersService.create(dto);
  }

  @ApiOperation({ summary: 'Отримання замовлень' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Отримання власних замовлень користувача' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('own')
  async getOwn(@User() { _id }: UserDocument) {
    return await this.ordersService.findCustomerOrders(_id);
  }

  @ApiOperation({ summary: 'Отримання замовлення за ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.ordersService.findById(id);
  }

  @ApiOperation({ summary: 'Оновлення замовлення' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Видалення замовлення' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return await this.ordersService.remove(id);
  }
}
