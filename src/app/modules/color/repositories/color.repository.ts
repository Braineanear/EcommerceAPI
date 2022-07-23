import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IColorDocument } from '../interfaces/color.interface';
import { Color } from '../models/color.entity';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class ColorRepository {
  constructor(
    @InjectModel(Color.name)
    protected readonly model: PaginateModel<IColorDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<IColorDocument> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<IColorDocument>): Promise<IColorDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<IColorDocument>): Promise<IColorDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<IColorDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IColorDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<IColorDocument>,
    update: UpdateQuery<IColorDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IColorDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<IColorDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<IColorDocument>) {
    return this.model.create(doc);
  }
}
