import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { CartDto } from './cart.dto';

export class PaginatedCartDto extends PaginatedResponseDto<CartDto> {
  docs: CartDto[];
}
