import { IsString } from 'class-validator';

export class PaymentDetailsDto {
  @IsString()
  method: string;

  @IsString()
  transactionId: string;

  @IsString()
  date: string;
}
