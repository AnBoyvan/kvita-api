import { IsString } from 'class-validator';

export class ExistDto {
  @IsString()
  email: string;
}
