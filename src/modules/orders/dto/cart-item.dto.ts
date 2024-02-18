import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { CONST } from 'src/constants';

export class CartItemDto {
  @ApiProperty()
  @IsString({ message: CONST.Order.DTO.productId })
  productId: string;

  @ApiProperty()
  @IsString({ message: CONST.Order.DTO.productName })
  productName: string;

  @ApiProperty()
  @IsString({ message: CONST.Order.DTO.productId })
  productImage: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.quantity })
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.price })
  price: number;

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
  sum: number;
}
