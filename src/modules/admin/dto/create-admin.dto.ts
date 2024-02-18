import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly name: string;
}
