import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { ICartDocument } from '../interfaces/cart.interface';
import { Cart } from '../models/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name)
    protected readonly model: PaginateModel<ICartDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<ICartDocument> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<ICartDocument>): Promise<ICartDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<ICartDocument>): Promise<ICartDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<ICartDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<ICartDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<ICartDocument>,
    update: UpdateQuery<ICartDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<ICartDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<ICartDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<ICartDocument>) {
    return this.model.create(doc);
  }
}
