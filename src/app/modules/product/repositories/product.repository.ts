import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery, UpdateQuery, Types } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { IProductDocument } from '../interfaces/product.interface';
import { Product } from '../models/product.entity';
@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    protected readonly model: PaginateModel<IProductDocument>,
  ) {}

  async create(doc: Partial<IProductDocument>): Promise<IProductDocument> {
    return this.model.create(doc);
  }

  async findById(id: string | Types.ObjectId): Promise<IProductDocument> {
    return this.model.findById(id, {}, { lean: true });
  }

  async findOne(
    filter: FilterQuery<IProductDocument>,
  ): Promise<IProductDocument> {
    return this.model.findOne(filter);
  }

  async find(
    filter: FilterQuery<IProductDocument>,
  ): Promise<IProductDocument[]> {
    return this.model.find(filter);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IProductDocument>,
  ): Promise<IProductDocument> {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async updateOne(
    filter: FilterQuery<IProductDocument>,
    update: UpdateQuery<IProductDocument>,
  ): Promise<IProductDocument> {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    });
  }

  async deleteById(id: string | Types.ObjectId): Promise<IProductDocument> {
    return this.model.findByIdAndRemove(id);
  }

  async deleteOne(
    filter: FilterQuery<IProductDocument>,
  ): Promise<IProductDocument> {
    return this.model.findOneAndRemove(filter, { useFindAndModify: false });
  }

  async paginate(
    filter: FilterQuery<IProductDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IProductDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }
}
