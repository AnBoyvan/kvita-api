import { IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class ChangePasswordRequestDto {
  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString()
  email: string;
}
