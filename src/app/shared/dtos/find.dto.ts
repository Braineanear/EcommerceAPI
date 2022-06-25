import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';

export class FindDto extends PaginateQueryOptionsDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'The search keyword',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
