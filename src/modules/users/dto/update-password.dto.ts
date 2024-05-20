import { IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class UpdatePasswordDto {
  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  @IsString()
  password: string;

  @IsString()
  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  newPassword: string;
}
