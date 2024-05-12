import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Model, PipelineStage, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CONST } from 'src/constants';
import { TelegramService } from 'src/modules/telegram/telegram.service';
import { Order, OrderDocument, Status } from 'src/schemas/order.schema';

import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IFindOrdersFilter } from './orders.interfaces';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly telegramService: TelegramService,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderDocument> {
    const status = Status.New;

    const publicId =
      `${format(new Date(), 'yy')}` +
      `${format(utcToZonedTime(new Date(), 'Europe/Kiev'), 'DDD')}` +
      `${uuid().substring(0, 4)}`;

    const newOrder = await this.orderModel.create({ ...dto, status, publicId });

    await this.telegramService.sendNewOrder(newOrder);

    return newOrder;
  }

  async findOrders(dto: FindOrdersDto): Promise<{
    result: OrderDocument[];
    count: number;
    minTotal: number;
    maxTotal: number;
  }> {
    const {
      product,
      status,
      totalMin,
      totalMax,
      customer,
      delivery,
      paid,
      createdStart,
      createdEnd,
      sortField = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit,
    } = dto;

    const filter: IFindOrdersFilter = {};
    const pipeline: PipelineStage[] = [];

    if (status) {
      const statusesArray = status.split(',');
      filter.status = { $in: statusesArray };
    }

    if (product) {
      filter['items.productId'] = product;
    }

    if (totalMin !== undefined && totalMax !== undefined) {
      filter.total = {
        $gte: Number(createdStart),
        $lte: Number(totalMax),
      };
    }

    if (customer) {
      filter['customer.id'] = customer;
    }

    if (delivery) {
      filter.delivery = delivery === 'true' ? true : false;
    }

    if (paid) {
      filter.paid = paid === 'true' ? true : false;
    }

    if (createdStart && createdEnd) {
      filter.createdAt = {
        $gte: new Date(createdStart),
        $lte: new Date(createdEnd),
      };
    }

    if (sortField && (sortOrder === 'asc' || sortOrder === 'desc')) {
      const sortOptions: { [key: string]: 1 | -1 } = {};
      sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
      pipeline.push({ $sort: sortOptions });
    }

    pipeline.push({
      $match: filter,
    });

    if (Number(limit) > 0) {
      const skip = (Number(page) - 1) * Number(limit);
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: Number(limit) });
    }

    const count = await this.orderModel.countDocuments(filter);
    const result = await this.orderModel.aggregate(pipeline);
    const totalRange = await this.orderModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          minTotal: { $min: '$total' },
          maxTotal: { $max: '$total' },
        },
      },
    ]);

    const minTotal = totalRange.length > 0 ? totalRange[0].minTotal : 0;
    const maxTotal = totalRange.length > 0 ? totalRange[0].maxTotal : 0;

    return { result, count, minTotal, maxTotal };
  }

  async findCustomerOrders(id: Types.ObjectId): Promise<OrderDocument[]> {
    return await this.orderModel.find({ 'customer.id': id.toString() });
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(CONST.Order.NOT_FOUND_ERROR);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!order) {
      throw new NotFoundException(CONST.Order.NOT_FOUND_ERROR);
    }

    return order;
  }

  async remove(id: string): Promise<{ _id: string; message: string }> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      throw new NotFoundException(CONST.Order.NOT_FOUND_ERROR);
    }

    return {
      _id: id,
      message: CONST.Order.REMOVE_SUCCESS,
    };
  }
}
