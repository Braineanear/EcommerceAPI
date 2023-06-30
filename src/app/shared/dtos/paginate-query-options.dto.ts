import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { SortDirectionEnum } from '../enums/sort-direction.enum';
import { SortByEnum } from '../enums/sot-by.enum';

export class PaginateQueryOptionsDto {
  @Transform((value: any) => parseInt(value, 10))
  @IsOptional()
  limit?: number = 10;

  @Transform((value: any) => parseInt(value, 10))
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  @IsEnum(SortByEnum)
  sortBy?: SortByEnum = SortByEnum.id;

  @IsOptional()
  @IsEnum(SortDirectionEnum)
  direction?: SortDirectionEnum = SortDirectionEnum.DESC;
}
