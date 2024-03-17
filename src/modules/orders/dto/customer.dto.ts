import { IsOptional, IsString, Matches } from 'class-validator';

import { CONST } from 'src/constants';

export class CustomerDto {
  @IsOptional()
  @IsString({ message: CONST.User.DTO.id })
  id?: string;

  @IsString({ message: CONST.User.DTO.name })
  name: string;

  @IsOptional()
  @IsString()
  email?: string;

  @Matches(CONST.Regexp.PHONE, { message: CONST.User.DTO.phone })
  @IsString()
  phone: string;
}
