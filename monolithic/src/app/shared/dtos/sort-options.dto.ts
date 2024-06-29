import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirectionEnum } from '../enums/sort-direction.enum';

export class SortOptionsDto {
  @ApiProperty({
    description: 'Field to sort by',
    example: '_id',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy: string = '_id';

  @ApiProperty({
    description: 'Sort direction',
    enum: SortDirectionEnum,
    example: SortDirectionEnum.DESC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirectionEnum)
  direction: SortDirectionEnum = SortDirectionEnum.DESC;
}
