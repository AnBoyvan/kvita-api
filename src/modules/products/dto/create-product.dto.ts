import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Category } from 'src/schemas/product.schema';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  promo?: number;

  @IsOptional()
  @IsNumber()
  promoPrice?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Category)
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
