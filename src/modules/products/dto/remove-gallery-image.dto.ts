import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveGalleryImageDto {
  @ApiProperty()
  @IsString()
  image: string;
}
