import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IBrandDocument } from '../interfaces/brand.interface';
import { Brand } from '../models/brand.entity';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectModel(Brand.name)
    protected readonly model: PaginateModel<IBrandDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<IBrandDocument> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<IBrandDocument>): Promise<IBrandDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<IBrandDocument>): Promise<IBrandDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<IBrandDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IBrandDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<IBrandDocument>,
    update: UpdateQuery<IBrandDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IBrandDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<IBrandDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<IBrandDocument>) {
    return this.model.create(doc);
  }
}
