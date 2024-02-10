import { IsNumber, IsString, Min } from 'class-validator';

export class CartItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsString()
  productImage: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  sum: number;
}
