import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';

export class FindImagesDto extends PaginateQueryOptionsDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Search Word',
    example: 'SFO',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
