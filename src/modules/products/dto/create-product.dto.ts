import { IsEnum, IsOptional, IsString } from 'class-validator';

import { CONST } from 'src/constants';
import { Category } from 'src/schemas/product.schema';

export class CreateProductDto {
  @IsString({ message: CONST.Product.DTO.name })
  name: string;

  @IsString({ message: CONST.Product.DTO.price })
  price: string;

  @IsOptional()
  @IsString()
  promo?: string;

  @IsOptional()
  @IsString()
  promoPrice?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Category, { message: CONST.Product.DTO.category })
  category: Category;

  @IsOptional()
  @IsString()
  calories?: string;

  @IsOptional()
  @IsString()
  proteins?: string;

  @IsOptional()
  @IsString()
  fats?: string;

  @IsOptional()
  @IsString()
  carbohydrates?: string;

  @IsOptional()
  @IsString()
  isActive?: string;

  @IsOptional()
  @IsString()
  isNewProduct?: string;
}
