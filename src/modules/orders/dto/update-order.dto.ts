import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CONST } from 'src/constants';
import { Status } from 'src/schemas/order.schema';

import { PaymentDetailsDto } from './payment-details.dto';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(Status, { message: CONST.Order.DTO.status })
  status?: Status;

  @IsOptional()
  @IsString()
  annotation?: string;

  @IsOptional()
  @IsBoolean()
  delivery?: boolean;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
