import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FormattedPaginateQueryOptionsDto } from '../dtos/formatted-paginate-query-options.dto';
import { PaginationOptionsDto } from '../dtos/pagination-options.dto';
import { SortDirectionValue } from '../enums/sort-direction.enum';
import { IPaginateOptions } from '../interfaces/i-paginate-options';

@Injectable()
export class PaginationPipe implements PipeTransform<any, FormattedPaginateQueryOptionsDto> {
  transform(value: any, metadata: ArgumentMetadata): FormattedPaginateQueryOptionsDto {
    const { page, limit, sortBy, direction, search, ...filter } = value;

    const sortVal = { [sortBy]: SortDirectionValue[direction] };
    const paginateOptions: IPaginateOptions = new PaginationOptionsDto({ page, limit }, sortVal);
    paginateOptions.lean = paginateOptions.lean ?? false;

    if (search) {
      filter['$or'] = [
        { name: { $regex: `^${search}`, $options: 'i' } },
        { code: { $regex: `^${search}`, $options: 'i' } },
      ];
    }

    return {
      filter,
      options: paginateOptions,
    } as FormattedPaginateQueryOptionsDto;
  }
}
