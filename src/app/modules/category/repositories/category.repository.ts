import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { ICategoryDocument } from '../interfaces/category.interface';
import { Category } from '../models/category.entity';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name)
    protected readonly model: PaginateModel<ICategoryDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<ICategoryDocument> {
    return this.model.findById(id);
  }

  async findOne(
    filter: FilterQuery<ICategoryDocument>,
  ): Promise<ICategoryDocument> {
    return this.model.findOne(filter);
  }

  async find(
    filter: FilterQuery<ICategoryDocument>,
  ): Promise<ICategoryDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<ICategoryDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<ICategoryDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<ICategoryDocument>,
    update: UpdateQuery<ICategoryDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<ICategoryDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<ICategoryDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<ICategoryDocument>) {
    return this.model.create(doc);
  }
}
