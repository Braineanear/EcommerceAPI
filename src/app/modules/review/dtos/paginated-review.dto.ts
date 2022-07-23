import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { ReviewDto } from './review.dto';

export class PaginatedReviewDto extends PaginatedResponseDto<ReviewDto> {
  docs: ReviewDto[];
}
