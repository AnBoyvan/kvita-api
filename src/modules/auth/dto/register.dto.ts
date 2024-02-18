import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class RegisterDto {
  @ApiProperty()
  @IsString({ message: CONST.User.DTO.name })
  name: string;

  @ApiProperty()
  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString()
  email: string;

  @ApiProperty()
  @Matches(CONST.Regexp.PHONE, { message: CONST.User.DTO.phone })
  @IsString()
  phone: string;

  @ApiProperty()
  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  @IsString()
  password: string;
}
