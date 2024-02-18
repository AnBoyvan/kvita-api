import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindOrdersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  product?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  totalMin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  totalMax?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  delivery?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paid?: string;

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
