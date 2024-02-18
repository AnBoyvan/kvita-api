import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { CONST } from 'src/constants';
import { Role } from 'src/schemas/user.schema';

export class UpdateByAdminDto {
  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role, { message: CONST.User.DTO.role })
  role?: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: CONST.User.DTO.discount })
  @IsPositive({ message: CONST.User.DTO.discount })
  discount?: number;
}
