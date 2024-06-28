import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Order, OrderDocument } from '../models/order.entity';

@Injectable()
export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name)
    protected readonly model: PaginateModel<OrderDocument>,
  ) {
    super(model);
  }
}
