import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Order, OrderDocument, Status } from 'src/schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { utcToZonedTime } from 'date-fns-tz';
import { FindOrdersDto } from './dto/find-orders.dto';
import { IFindOrdersFilter } from './orders.interfaces';
import {
  ORDER_NOT_FOUND_ERROR,
  ORDER_REMOVE_SUCCES,
} from 'src/constants/order.constants';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderDocument> {
    const status = Status.New;

    const publicId =
      `${format(new Date(), 'yy')}` +
      `${format(utcToZonedTime(new Date(), 'Europe/Kiev'), 'DDD')}` +
      `${uuid().substring(0, 4)}`;

    return await this.orderModel.create({ ...dto, status, publicId });
  }

  async findOrders(dto: FindOrdersDto): Promise<OrderDocument[]> {
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
      limit = 100,
    } = dto;

    const skip = (Number(page) - 1) * Number(limit);
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
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });

    return await this.orderModel.aggregate(pipeline);
  }

  async findCustomerOrders(id: Types.ObjectId): Promise<OrderDocument[]> {
    return await this.orderModel.find({ 'customer.id': id.toString() });
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND_ERROR);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND_ERROR);
    }

    return order;
  }

  async remove(id: string): Promise<{ _id: string; message: string }> {
    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND_ERROR);
    }

    const deletedOrder = await this.orderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      throw new NotFoundException(ORDER_NOT_FOUND_ERROR);
    }

    return {
      _id: id,
      message: ORDER_REMOVE_SUCCES,
    };
  }
}
