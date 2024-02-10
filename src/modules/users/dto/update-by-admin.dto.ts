import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Role } from 'src/schemas/user.schema';

export class UpdateByAdminDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsNumber()
  discount?: number;
}
