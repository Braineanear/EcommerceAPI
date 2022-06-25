import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { ImageDto } from './image.dto';

export class PaginatedImageDto extends PaginatedResponseDto<ImageDto> {
  docs: ImageDto[];
}
