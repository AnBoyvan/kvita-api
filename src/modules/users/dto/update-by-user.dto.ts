import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

import { CONST } from 'src/constants';
import { CartItemDto } from 'src/modules/orders/dto/cart-item.dto';

export class UpdateByUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Matches(CONST.Regexp.EMAIL, { message: CONST.User.DTO.email })
  @IsString()
  email?: string;

  @IsOptional()
  @Matches(CONST.Regexp.PHONE, { message: CONST.User.DTO.phone })
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cart?: CartItemDto[];
}
