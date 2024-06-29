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
    return createdModel.save() as Promise<T>;
  }

  async findById(_id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findById(_id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(
    filter: FilterQuery<T>,
    projection: any = null,
    sort: any = { _id: -1 },
  ): Promise<T[]> {
    return this.model.find(filter, projection).sort(sort);
  }

  async updateById(_id: string | Types.ObjectId, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(_id, update, { new: true });
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<any> {
    return this.model.updateMany(filter, update);
  }

  async deleteById(_id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndRemove(_id);
  }

  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndRemove(filter);
  }

  async deleteMany(filter: FilterQuery<T>): Promise<any> {
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
