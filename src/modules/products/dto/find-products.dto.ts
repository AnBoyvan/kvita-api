import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindProductsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isActive?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isNewProduct?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  promo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceMin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceMax?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdEnd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  updatedStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  updatedEnd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  limit?: string;
}
