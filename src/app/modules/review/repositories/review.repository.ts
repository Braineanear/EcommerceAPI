import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { IReviewDocument } from '../interfaces/review.interface';
import { Review } from '../models/review.entity';

@Injectable()
export class ReviewRepository extends BaseRepository<IReviewDocument> {
  constructor(
    @InjectModel(Review.name)
    protected readonly model: PaginateModel<IReviewDocument>,
  ) {
    super(model);
  }
}
