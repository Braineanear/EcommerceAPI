import { IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';

export class FindUsersDto extends PaginateQueryOptionsDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Search Word',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
