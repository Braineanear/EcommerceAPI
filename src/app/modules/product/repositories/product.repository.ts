import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { Product, ProductDocument } from '../models/product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    protected readonly model: PaginateModel<ProductDocument>,
  ) {
    super(model);
  }
}
