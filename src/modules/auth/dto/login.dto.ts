import { IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class LoginDto {
  @IsString()
  login: string;

  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  @IsString()
  password: string;
}
