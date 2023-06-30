import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

import { IPaginateOptions } from '../interfaces/i-paginate-options';

export class PaginationOptionsDto implements IPaginateOptions {
  constructor(pagination: IPaginateOptions, sorting: Object | string) {
    this.page = pagination.page || this.page;
    this.limit = pagination.limit || this.limit;
    this.sort = sorting || this.sort;
  }

  select?: Object | string;
  sort?: Object | string;
  populate?: Array<Object> | Array<string> | Object | string;
  lean?: boolean = false;
  leanWithId?: boolean = false;

  @Transform((value: any) => parseInt(value, 10))
  @IsOptional()
  limit?: number = 10;

  @Transform((value: any) => parseInt(value, 10))
  @IsOptional()
  page?: number = 1;
}
