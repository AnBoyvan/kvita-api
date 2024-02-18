import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CONST } from 'src/constants';

export class CreateReviewDto {
  @ApiProperty()
  @IsString({ message: CONST.Review.DTO.productId })
  productId: string;

  @ApiProperty()
  @IsString({ message: CONST.Review.DTO.comment })
  comment: string;
}
