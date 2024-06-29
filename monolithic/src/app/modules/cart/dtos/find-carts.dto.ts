import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';

export class FindCartsDto extends PaginateQueryOptionsDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Search Word',
    example: 'cart',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
