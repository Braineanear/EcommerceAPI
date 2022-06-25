import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery, UpdateQuery, Types } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { IUserDocument } from '../interfaces/user.interface';
import { User } from '../models/user.entity';
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    protected readonly model: PaginateModel<IUserDocument>,
  ) {}

  async create(doc: Partial<IUserDocument>): Promise<IUserDocument> {
    return this.model.create(doc);
  }

  async findById(id: string | Types.ObjectId): Promise<IUserDocument> {
    return this.model.findById(id, {}, { lean: true });
  }

  async findOne(filter: FilterQuery<IUserDocument>): Promise<IUserDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<IUserDocument>): Promise<IUserDocument[]> {
    return this.model.find(filter);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IUserDocument>,
  ): Promise<IUserDocument> {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async updateOne(
    filter: FilterQuery<IUserDocument>,
    update: UpdateQuery<IUserDocument>,
  ): Promise<IUserDocument> {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    });
  }

  async deleteById(id: string | Types.ObjectId): Promise<IUserDocument> {
    return this.model.findByIdAndRemove(id);
  }

  async deleteOne(filter: FilterQuery<IUserDocument>): Promise<IUserDocument> {
    return this.model.findOneAndRemove(filter, { useFindAndModify: false });
  }

  async paginate(
    filter: FilterQuery<IUserDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IUserDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }
}
