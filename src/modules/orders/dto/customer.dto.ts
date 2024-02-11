import { IsOptional, IsString } from 'class-validator';

export class CustomerDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  phone: string;
}
