import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Status } from 'src/schemas/order.schema';
import { PaymentDetailsDto } from './payment-details.dto';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(Status)
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
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
