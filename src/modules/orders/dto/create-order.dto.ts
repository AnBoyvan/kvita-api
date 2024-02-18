import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: CONST.User.DTO.discount })
  @Min(0, { message: CONST.Order.DTO.discount })
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.price })
  discountSum?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.sum })
  total: number;

  @ApiProperty({ type: () => CustomerDto })
  @ValidateNested({ each: true })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: CONST.Order.DTO.comment })
  comment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  delivery?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @ApiPropertyOptional({ type: () => PaymentDetailsDto })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
