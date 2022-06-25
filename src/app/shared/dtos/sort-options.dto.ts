import { SortDirectionEnum } from '../enums/sort-direction.enum';

export class SortOptionsDto {
  sortBy: string = '_id';
  direction: SortDirectionEnum = SortDirectionEnum.DESC;
}
