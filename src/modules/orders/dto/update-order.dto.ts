import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsEnum(Status, { message: CONST.Order.DTO.status })
  status?: Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  annotation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  delivery?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @ApiPropertyOptional({ type: () => PaymentDetailsDto })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
