import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { CategoryDto } from './category.dto';

export class PaginatedCategoryDto extends PaginatedResponseDto<CategoryDto> {
  docs: CategoryDto[];
}
