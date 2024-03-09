import { IsOptional, IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class RegisterDto {
  @IsString({ message: CONST.User.DTO.name })
  name: string;

  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString({ message: CONST.User.DTO.email })
  email: string;

  @IsOptional()
  @Matches(CONST.Regexp.PHONE, { message: CONST.User.DTO.phone })
  @IsString()
  phone?: string;

  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  @IsString({ message: CONST.User.DTO.password })
  password: string;
}
