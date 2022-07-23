import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { ISizeDocument } from '../interfaces/size.interface';
import { Size } from '../models/size.entity';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class SizeRepository {
  constructor(
    @InjectModel(Size.name)
    protected readonly model: PaginateModel<ISizeDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<ISizeDocument> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<ISizeDocument>): Promise<ISizeDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<ISizeDocument>): Promise<ISizeDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<ISizeDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<ISizeDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<ISizeDocument>,
    update: UpdateQuery<ISizeDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<ISizeDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<ISizeDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<ISizeDocument>) {
    return this.model.create(doc);
  }
}
