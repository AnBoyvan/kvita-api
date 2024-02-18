import { IsOptional, IsString } from 'class-validator';

export class FindPicturesDto {
  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
