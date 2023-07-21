import { Document, FilterQuery, PaginateModel, Types, UpdateQuery } from 'mongoose';

import { Injectable } from '@nestjs/common';

import { IBaseRepository } from '../interfaces/i-base-repository.interface';
import { IPaginateOptions } from '../interfaces/i-paginate-options';
import { IPaginatedInterface } from '../interfaces/i-paginate-result.interface';

@Injectable()
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: PaginateModel<T>) {}

  async create(doc: Partial<T>): Promise<T> {
    return this.model.create(doc);
  }

  async save(doc: T): Promise<T> {
    const createdModel = new this.model(doc);
    return createdModel.save() as any;
  }

  async findById(_id: string | Types.ObjectId): Promise<T> {
    return this.model.findById(_id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filter);
  }
  async find(
    filter: FilterQuery<T>,
    projection: any = null,
    sort: any = { _id: -1 },
  ): Promise<T[]> {
    return this.model.find(filter, projection).sort(sort);
  }

  async updateById(_id: string | Types.ObjectId, update: object): Promise<T> {
    return this.model.findByIdAndUpdate(_id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    });
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<any> {
    return this.model.updateMany(filter, update, { new: true });
  }

  async deleteById(_id: string | Types.ObjectId): Promise<T> {
    return this.model.findByIdAndRemove(_id);
  }

  async deleteOne(filter: object): Promise<T> {
    return this.model.findOneAndRemove(filter, { useFindAndModify: false });
  }

  async deleteMany(filter: object): Promise<any> {
    return this.model.deleteMany(filter);
  }

  async paginate(
    filter: object,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<T>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async aggregate(pipeline: any[]): Promise<any> {
    return this.model.aggregate(pipeline);
  }
}
