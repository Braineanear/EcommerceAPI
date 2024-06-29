import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { TagDto } from './tag.dto';

export class PaginatedTagDto extends PaginatedResponseDto<TagDto> {
  docs: TagDto[];
}
