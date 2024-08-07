import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { Review, ReviewDocument } from '../models/review.entity';

@Injectable()
export class ReviewRepository extends BaseRepository<ReviewDocument> {
  constructor(
    @InjectModel(Review.name)
    protected readonly model: PaginateModel<ReviewDocument>,
  ) {
    super(model);
  }
}
