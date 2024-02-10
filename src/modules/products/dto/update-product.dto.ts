import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Category } from 'src/schemas/product.schema';

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsOptional()
  @IsString()
  imageURL?: string;

  @IsOptional()
  @IsArray()
  imageGallery?: string[];

  @IsEnum(Category)
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
