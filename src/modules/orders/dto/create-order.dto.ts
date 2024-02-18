import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { CONST } from 'src/constants';

import { CartItemDto } from './cart-item.dto';
import { CustomerDto } from './customer.dto';
import { PaymentDetailsDto } from './payment-details.dto';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsOptional()
  @IsNumber({}, { message: CONST.User.DTO.discount })
  @Min(0, { message: CONST.Order.DTO.discount })
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.price })
  discountSum?: number;

  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.sum })
  total: number;

  @ValidateNested({ each: true })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsOptional()
  @IsString({ message: CONST.Order.DTO.comment })
  comment?: string;

  @IsOptional()
  @IsBoolean()
  delivery?: boolean;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
