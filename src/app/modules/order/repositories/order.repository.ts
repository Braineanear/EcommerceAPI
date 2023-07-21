import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IOrderDocument } from '../interfaces/order.interface';
import { Order } from '../models/order.entity';

@Injectable()
export class OrderRepository extends BaseRepository<IOrderDocument> {
  constructor(
    @InjectModel(Order.name)
    protected readonly model: PaginateModel<IOrderDocument>,
  ) {
    super(model);
  }
}
