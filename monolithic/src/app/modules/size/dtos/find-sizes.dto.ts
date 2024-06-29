import { IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';

export class FindSizesDto extends PaginateQueryOptionsDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Search Word',
    example: 'XL',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
