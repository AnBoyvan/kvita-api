import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { CONST } from 'src/constants';
import { Category } from 'src/schemas/product.schema';

export class CreateProductDto {
  @ApiProperty()
  @IsString({ message: CONST.Product.DTO.name })
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: CONST.Product.DTO.price })
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  promo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  promoPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Category })
  @IsEnum(Category, { message: CONST.Product.DTO.category })
  category: Category;

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
}
