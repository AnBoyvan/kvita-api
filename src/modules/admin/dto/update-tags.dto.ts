import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateTagsDto {
  @ApiProperty({ type: [String], example: ['tag1', 'tag2'] })
  @IsArray({ each: true })
  tags: string[];
}
