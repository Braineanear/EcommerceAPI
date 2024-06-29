import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FormattedPaginateQueryOptionsDto } from '../dtos/formatted-paginate-query-options.dto';
import { PaginationOptionsDto } from '../dtos/pagination-options.dto';
import { SortDirectionValue } from '../enums/sort-direction.enum';
import { IPaginateOptions } from '../interfaces/i-paginate-options';

export const Paginate = createParamDecorator(
  (data: unknown, context: ExecutionContext): FormattedPaginateQueryOptionsDto => {
    const request = context.switchToHttp().getRequest();
    const { page, limit, sortBy, direction, ...filter } = request.query;

    const sortVal = sortBy ? { [sortBy]: SortDirectionValue[direction] } : {};
    const paginateOptions = new PaginationOptionsDto(
      {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10
      },
      sortVal,
    );

    paginateOptions.lean = paginateOptions.lean ?? false;

    return {
      filter,
      options: paginateOptions,
    };
  },
);
