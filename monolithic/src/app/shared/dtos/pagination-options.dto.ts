import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

import { IPaginateOptions } from '../interfaces/i-paginate-options';

export class PaginationOptionsDto implements IPaginateOptions {
  constructor(pagination: Partial<IPaginateOptions> = {}, sorting: Object | string = {}) {
    this.page = pagination.page ?? this.page;
    this.limit = pagination.limit ?? this.limit;
    this.sort = sorting ?? this.sort;
  }

  select?: Object | string;
  sort?: Object | string;
  populate?: Array<Object> | Array<string> | Object | string;
  lean: boolean = false;
  leanWithId: boolean = false;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  limit: number = 10;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  page: number = 1;
}
