import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { ColorDto } from './color.dto';

export class PaginatedColorDto extends PaginatedResponseDto<ColorDto> {
  docs: ColorDto[];
}
