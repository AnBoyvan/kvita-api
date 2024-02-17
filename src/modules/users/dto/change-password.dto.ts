import { IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class ChangePasswordDto {
  @IsString()
  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  password: string;
}
