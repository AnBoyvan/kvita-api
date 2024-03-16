import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { CONST } from 'src/constants';

export class CartItemDto {
  @IsString({ message: CONST.Order.DTO.productId })
  productId: string;

  @IsString({ message: CONST.Order.DTO.productName })
  productName: string;

  @IsString({ message: CONST.Order.DTO.productId })
  productImage: string;

  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.quantity })
  quantity: number;

  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.price })
  price: number;

  @IsOptional()
  @IsNumber()
  promo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  promoPrice?: number;

  @IsNumber()
  @Min(0, { message: CONST.Order.DTO.sum })
  sum: number;
}
