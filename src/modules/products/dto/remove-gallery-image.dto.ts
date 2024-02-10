import { IsString } from 'class-validator';

export class RemoveGalleryImageDto {
  @IsString()
  image: string;
}
