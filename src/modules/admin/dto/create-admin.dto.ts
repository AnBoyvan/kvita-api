import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'tags' })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly name: string;
}
