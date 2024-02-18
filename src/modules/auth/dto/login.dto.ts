import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class LoginDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(CONST.Regexp.PHONE, { message: CONST.User.DTO.phone })
  @IsString()
  phone?: string;

  @ApiProperty()
  @Matches(CONST.Regexp.PASSWORD, { message: CONST.User.DTO.password })
  @IsString()
  password: string;
}
