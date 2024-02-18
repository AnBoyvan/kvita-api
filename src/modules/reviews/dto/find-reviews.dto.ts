import { IsOptional, IsString } from 'class-validator';

export class FindReviewsDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;
}
