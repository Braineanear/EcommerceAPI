import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery, UpdateQuery, Types } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { ITokenDocument } from '../interfaces/token.interface';
import { Token } from '../models/token.entity';
@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(Token.name)
    protected readonly model: PaginateModel<ITokenDocument>,
  ) {}

  async create(doc: Partial<ITokenDocument>): Promise<ITokenDocument> {
    return this.model.create(doc);
  }

  async findById(id: string | Types.ObjectId): Promise<ITokenDocument> {
    return this.model.findById(id, {}, { lean: true });
  }

  async findOne(filter: FilterQuery<ITokenDocument>): Promise<ITokenDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<ITokenDocument>): Promise<ITokenDocument[]> {
    return this.model.find(filter);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<ITokenDocument>,
  ): Promise<ITokenDocument> {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async updateOne(
    filter: FilterQuery<ITokenDocument>,
    update: UpdateQuery<ITokenDocument>,
  ): Promise<ITokenDocument> {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    });
  }

  async deleteById(id: string | Types.ObjectId): Promise<ITokenDocument> {
    return this.model.findByIdAndRemove(id);
  }

  async deleteOne(
    filter: FilterQuery<ITokenDocument>,
  ): Promise<ITokenDocument> {
    return this.model.findOneAndRemove(filter, { useFindAndModify: false });
  }

  async paginate(
    filter: FilterQuery<ITokenDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<ITokenDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }
}
