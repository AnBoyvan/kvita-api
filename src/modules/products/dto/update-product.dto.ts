import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { CONST } from 'src/constants';
import { Category } from 'src/schemas/product.schema';

export class UpdateProductDto {
  @IsString({ message: CONST.Product.DTO.name })
  name: string;

  @IsNumber()
  @Min(0, { message: CONST.Product.DTO.price })
  price?: number;

  @IsOptional()
  @IsNumber()
  promo?: number;

  @IsOptional()
  @IsNumber()
  promoPrice?: number;

  @IsOptional()
  @IsString()
  imageURL?: string;

  @IsOptional()
  @IsArray()
  imageGallery?: string[];

  @IsEnum(Category, { message: CONST.Product.DTO.category })
  category: Category;

  @IsOptional()
  @IsString()
  description?: string;

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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isNewProduct?: boolean;
}
