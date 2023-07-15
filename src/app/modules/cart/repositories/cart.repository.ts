import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { ICartDocument } from '../interfaces/cart.interface';
import { Cart } from '../models/cart.entity';

@Injectable()
export class CartRepository extends BaseRepository<ICartDocument> {
  constructor(
    @InjectModel(Cart.name)
    protected readonly model: PaginateModel<ICartDocument>,
  ) {
    super(model);
  }
}
