import { PartialType } from '@nestjs/swagger';
import { Product } from '../models/product.entity';

export class ProductDto extends PartialType(Product) {}
