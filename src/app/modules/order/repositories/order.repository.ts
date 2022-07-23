import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IOrderDocument } from '../interfaces/order.interface';
import { Order } from '../models/order.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    protected readonly model: PaginateModel<IOrderDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<IOrderDocument> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<IOrderDocument>): Promise<IOrderDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<IOrderDocument>): Promise<IOrderDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<IOrderDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IOrderDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<IOrderDocument>,
    update: UpdateQuery<IOrderDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IOrderDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<IOrderDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<IOrderDocument>) {
    return this.model.create(doc);
  }
}
