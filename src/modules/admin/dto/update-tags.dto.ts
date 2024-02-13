import { IsArray } from 'class-validator';

export class UpdateTagsDto {
  @IsArray()
  tags: string[];
}
