import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { ITagDocument } from '../interfaces/tag.interface';
import { Tag } from '../models/tag.entity';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class TagRepository {
  constructor(
    @InjectModel(Tag.name)
    protected readonly model: PaginateModel<ITagDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<ITagDocument> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<ITagDocument>): Promise<ITagDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<ITagDocument>): Promise<ITagDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<ITagDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<ITagDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<ITagDocument>,
    update: UpdateQuery<ITagDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<ITagDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<ITagDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<ITagDocument>) {
    return this.model.create(doc);
  }
}
