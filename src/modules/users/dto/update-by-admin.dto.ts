import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { CONST } from 'src/constants';
import { Role } from 'src/schemas/user.schema';

export class UpdateByAdminDto {
  @IsOptional()
  @IsEnum(Role, { message: CONST.User.DTO.role })
  role?: Role;

  @IsOptional()
  @IsNumber({}, { message: CONST.User.DTO.discount })
  @Min(0, { message: CONST.User.DTO.discount })
  discount?: number;
}
