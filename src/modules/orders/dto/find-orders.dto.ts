import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindOrdersDto {
  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  totalMin?: string;

  @IsOptional()
  @IsString()
  totalMax?: string;

  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  delivery?: string;

  @IsOptional()
  @IsString()
  paid?: string;

  @IsOptional()
  @IsString()
  createdStart?: string;

  @IsOptional()
  @IsString()
  createdEnd?: string;

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
