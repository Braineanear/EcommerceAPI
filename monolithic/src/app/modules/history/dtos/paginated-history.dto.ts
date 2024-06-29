import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { HistoryDto } from './history.dto';

export class PaginatedHistoryDto extends PaginatedResponseDto<HistoryDto> {
  docs: HistoryDto[];
}
