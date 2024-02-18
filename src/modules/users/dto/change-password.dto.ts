import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  password: string;
}
