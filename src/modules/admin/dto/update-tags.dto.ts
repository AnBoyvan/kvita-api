import { IsArray } from 'class-validator';

export class UpdateTagsDto {
  @IsArray({ each: true })
  tags: string[];
}
