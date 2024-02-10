import { IsArray, IsOptional, IsString } from 'class-validator';
import { CartItemDto } from 'src/modules/orders/dto/cart-item.dto';

export class UpdateByUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  cart?: CartItemDto[];
}
