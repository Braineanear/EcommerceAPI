import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Cart, CartDocument } from '../models/cart.entity';

@Injectable()
export class CartRepository extends BaseRepository<CartDocument> {
  constructor(
    @InjectModel(Cart.name)
    protected readonly model: PaginateModel<CartDocument>,
  ) {
    super(model);
  }
}
