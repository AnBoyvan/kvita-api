import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class ChangePasswordRequestDto {
  @ApiProperty()
  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString()
  email: string;
}
