import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { IProductDocument } from '../interfaces/product.interface';
import { Product } from '../models/product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<IProductDocument> {
  constructor(
    @InjectModel(Product.name)
    protected readonly model: PaginateModel<IProductDocument>,
  ) {
    super(model);
  }
}
