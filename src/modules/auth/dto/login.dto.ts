import { IsOptional, IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class LoginDto {
  @IsOptional()
  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString()
  email?: string;

  @IsOptional()
  @Matches(CONST.Regexp.PHONE, { message: CONST.User.DTO.phone })
  @IsString()
  phone?: string;

  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  @IsString()
  password: string;
}
