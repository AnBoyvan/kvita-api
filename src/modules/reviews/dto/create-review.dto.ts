import { IsString } from 'class-validator';

import { CONST } from 'src/constants';

export class CreateReviewDto {
  @IsString({ message: CONST.Review.DTO.productId })
  productId: string;

  @IsString({ message: CONST.Review.DTO.comment })
  comment: string;
}
