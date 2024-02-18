import { IsString } from 'class-validator';

import { CONST } from 'src/constants';

export class UpdateReviewDto {
  @IsString({ message: CONST.Review.DTO.comment })
  comment: string;
}
