import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class CustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: CONST.User.DTO.id })
  id?: string;

  @ApiProperty()
  @IsString({ message: CONST.User.DTO.name })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString()
  email?: string;

  @ApiProperty()
  @Matches(CONST.Regexp.PHONE, { message: CONST.User.DTO.phone })
  @IsString()
  phone: string;
}
