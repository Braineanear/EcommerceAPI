import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IImageDocument } from '../interfaces/image.interface';
import { Image } from '../models/image.entity';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectModel(Image.name)
    protected readonly model: PaginateModel<IImageDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<IImageDocument> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<IImageDocument>): Promise<IImageDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<IImageDocument>): Promise<IImageDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<IImageDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IImageDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<IImageDocument>,
    update: UpdateQuery<IImageDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IImageDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<IImageDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<IImageDocument>) {
    return this.model.create(doc);
  }
}
