import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString({ message: CONST.Product.DTO.name })
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0, { message: CONST.Product.DTO.price })
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  promo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  promoPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  imageGallery?: string[];

  @ApiProperty({ enum: Category })
  @IsEnum(Category, { message: CONST.Product.DTO.category })
  category: Category;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  proteins?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fats?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  carbohydrates?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isNewProduct?: boolean;
}
