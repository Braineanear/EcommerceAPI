import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { SizeDto } from './size.dto';

export class PaginatedSizeDto extends PaginatedResponseDto<SizeDto> {
  docs: SizeDto[];
}
