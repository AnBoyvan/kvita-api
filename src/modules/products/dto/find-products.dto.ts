import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  isActive?: string;

  @IsOptional()
  @IsString()
  isNewProduct?: string;

  @IsOptional()
  @IsString()
  promo?: string;

  @IsOptional()
  @IsString()
  priceMin?: string;

  @IsOptional()
  @IsString()
  priceMax?: string;

  @IsOptional()
  @IsString()
  createdStart?: string;

  @IsOptional()
  @IsString()
  createdEnd?: string;

  @IsOptional()
  @IsString()
  updatedStart?: string;

  @IsOptional()
  @IsString()
  updatedEnd?: string;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
