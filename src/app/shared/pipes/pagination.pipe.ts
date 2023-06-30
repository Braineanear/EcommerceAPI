import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { FormattedPaginateQueryOptionsDto } from '../dtos/formatted-paginate-query-options.dto';
import { PaginationOptionsDto } from '../dtos/pagination-options.dto';
import { SortDirectionValue } from '../enums/sort-direction.enum';
import { IPaginateOptions } from '../interfaces/i-paginate-options';

@Injectable()
export class PaginationPipe
  implements PipeTransform<any, FormattedPaginateQueryOptionsDto>
{
  transform(value: any, metadata: ArgumentMetadata) {
    const { page, limit, sortBy, direction, ...filter } = value;
    const sortVal: any = { [sortBy]: SortDirectionValue[direction] };
    const paginateOptions: IPaginateOptions = new PaginationOptionsDto(
      { page: page, limit: limit },
      sortVal,
    );

    paginateOptions.lean = paginateOptions.lean ? paginateOptions.lean : false;

    if (filter.search) {
      filter['$or'] = [
        {
          name: {
            $regex: '^' + filter.search,
            $options: 'i',
          },
        },
        {
          code: {
            $regex: '^' + filter.search,
            $options: 'i',
          },
        },
      ];

      delete filter.search;
    }

    return {
      filter,
      options: paginateOptions,
    } as FormattedPaginateQueryOptionsDto;
  }
}
