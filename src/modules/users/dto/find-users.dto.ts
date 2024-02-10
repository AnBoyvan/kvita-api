import { IsOptional, IsString } from 'class-validator';

export class FindUsersDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  verify?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  minDiscount?: string;

  @IsOptional()
  @IsString()
  maxDiscount?: string;

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
  sortOrder?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
