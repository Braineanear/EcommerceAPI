import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { BrandDto } from './brand.dto';

export class PaginatedBrandDto extends PaginatedResponseDto<BrandDto> {
  docs: BrandDto[];
}
