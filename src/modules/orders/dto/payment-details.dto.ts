import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentDetailsDto {
  @ApiProperty()
  @IsString()
  method: string;

  @ApiProperty()
  @IsString()
  transactionId: string;

  @ApiProperty()
  @IsString()
  date: string;
}
