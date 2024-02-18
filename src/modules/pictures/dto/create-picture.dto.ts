import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePictureDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
