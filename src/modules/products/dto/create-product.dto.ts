import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { CONST } from 'src/constants';
import { Category } from 'src/schemas/product.schema';

export class CreateProductDto {
  @IsString({ message: CONST.Product.DTO.name })
  name: string;

  @IsNumber()
  @Min(0, { message: CONST.Product.DTO.price })
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  promo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  promoPrice?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Category, { message: CONST.Product.DTO.category })
  category: Category;

  @IsOptional()
  @IsNumber()
  calories?: number;

  @IsOptional()
  @IsNumber()
  proteins?: number;

  @IsOptional()
  @IsNumber()
  fats?: number;

  @IsOptional()
  @IsNumber()
  carbohydrates?: number;
}
