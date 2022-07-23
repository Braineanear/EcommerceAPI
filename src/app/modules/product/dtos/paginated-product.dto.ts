import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { ProductDto } from './product.dto';

export class PaginatedProductDto extends PaginatedResponseDto<ProductDto> {
  docs: ProductDto[];
}
