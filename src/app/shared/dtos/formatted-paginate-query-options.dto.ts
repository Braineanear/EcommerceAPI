import { ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationOptionsDto } from './pagination-options.dto';

export class FormattedPaginateQueryOptionsDto {
  @ApiProperty({ description: 'Pagination options' })
  @ValidateNested()
  @Type(() => PaginationOptionsDto)
  options: PaginationOptionsDto;

  @ApiProperty({ description: 'Filter criteria' })
  @IsObject()
  filter: object;
}
