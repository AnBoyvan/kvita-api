import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CartItemDto } from './cart-item.dto';
import { CustomerDto } from './customer.dto';
import { PaymentDetailsDto } from './payment-details.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  discountSum?: number;

  @IsNumber()
  total: number;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsOptional()
  @IsString()
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
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
