import { PartialType } from '@nestjs/swagger';

import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  ratingsQuantity?: number;
  ratingsAverage?: number;
  isOutOfStock?: boolean;
  sold?: number;
}
