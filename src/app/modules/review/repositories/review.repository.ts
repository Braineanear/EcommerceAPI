import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { IReviewDocument } from '../interfaces/review.interface';
import { Review } from '../models/review.entity';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review.name)
    protected readonly model: PaginateModel<IReviewDocument>,
  ) {}

  async findById(id: string | Types.ObjectId): Promise<IReviewDocument> {
    return this.model.findById(id);
  }

  async findOne(
    filter: FilterQuery<IReviewDocument>,
  ): Promise<IReviewDocument> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<IReviewDocument>): Promise<IReviewDocument[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: FilterQuery<IReviewDocument>,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IReviewDocument>> {
    return this.model.paginate(filter, paginateOptions);
  }

  async updateOne(
    filter: FilterQuery<IReviewDocument>,
    update: UpdateQuery<IReviewDocument>,
  ) {
    return this.model.updateOne(filter, update);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IReviewDocument>,
  ) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      useFindAndModify: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<IReviewDocument>) {
    return this.model.deleteOne(filter);
  }

  async create(doc: Partial<IReviewDocument>) {
    return this.model.create(doc);
  }

  async aggregate(pipeline: any[]): Promise<any> {
    return this.model.aggregate(pipeline);
  }
}
