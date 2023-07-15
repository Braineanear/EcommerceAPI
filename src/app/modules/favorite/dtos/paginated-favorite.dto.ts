import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { FavoriteDto } from './favorite.dto';

export class PaginatedFavoriteDto extends PaginatedResponseDto<FavoriteDto> {
  docs: FavoriteDto[];
}
