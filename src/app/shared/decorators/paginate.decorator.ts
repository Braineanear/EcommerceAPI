import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { FormattedPaginateQueryOptionsDto } from '../dtos/formatted-paginate-query-options.dto';
import { PaginationOptionsDto } from '../dtos/pagination-options.dto';
import { SortDirectionValue } from '../enums/sort-direction.enum';
import { IPaginateOptions } from '../interfaces/i-paginate-options';

export const Paginate = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const user = ctx.getRequest().user;
    const query = ctx.getRequest().query;
    const { page, limit, sortBy, direction, language, ...filter } = query;
    const sortVal: any = { [sortBy]: SortDirectionValue[direction] };
    const paginateOptions: IPaginateOptions = new PaginationOptionsDto(
      { page: parseInt(page), limit: parseInt(limit) },
      sortVal,
    );
    paginateOptions.lean = paginateOptions.lean ? paginateOptions.lean : false;
    const formatted: FormattedPaginateQueryOptionsDto = {
      filter,
      options: paginateOptions,
    };
    return formatted;
  },
);
