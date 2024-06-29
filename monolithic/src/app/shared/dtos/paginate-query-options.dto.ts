import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { SortDirectionEnum } from '../enums/sort-direction.enum';
import { SortByEnum } from '../enums/sort-by.enum';

export class PaginateQueryOptionsDto {
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  limit: number = 10;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsEnum(SortByEnum)
  sortBy: SortByEnum = SortByEnum.id;

  @IsOptional()
  @IsEnum(SortDirectionEnum)
  direction: SortDirectionEnum = SortDirectionEnum.DESC;
}
