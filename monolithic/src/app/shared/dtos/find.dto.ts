import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateQueryOptionsDto } from './paginate-query-options.dto';

export class FindDto extends PaginateQueryOptionsDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'The search keyword',
    example: 'example keyword',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
