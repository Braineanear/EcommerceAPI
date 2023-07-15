import { Types } from 'mongoose';

import { ProductService } from '@modules/product/product.service';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { BaseService } from '@shared/services/base.service';

import { CreateReviewDto } from './dtos/create-review.dto';
import { ReviewRepository } from './repositories/review.repository';

@Injectable()
export class ReviewService extends BaseService<ReviewRepository> {
  constructor(
    protected readonly repository: ReviewRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly productService: ProductService,
  ) {
    super();
  }
  async updateReview(id: string, update: object, user: IUserDocument) {
    const review = await this.findById(id);

    if (review.user.toString() !== user._id.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }

    if (update['rating']) {
      const product = await this.productService.findById(review.product);

      const previousRating = review.rating;
      product.ratingsAverage =
        (product.ratingsAverage * product.ratingsQuantity -
          previousRating +
          update['rating']) /
        product.ratingsQuantity;

      await product.save();
    }

    return await this.repository.updateById(id, update);
  }

  async deleteReview(id: string, user: IUserDocument) {
    const review = await this.findById(id);

    if (review.user.toString() !== user._id.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }

    const product = await this.productService.findById(review.product);

    product.ratingsQuantity--;

    if (product.ratingsQuantity === 0) {
      product.ratingsAverage = 0;
    } else {
      product.ratingsAverage =
        (product.ratingsAverage * product.ratingsQuantity - review.rating) /
        (product.ratingsQuantity - 1);
    }

    await product.save();

    return await this.repository.deleteById(id);
  }

  async create(doc: CreateReviewDto, user: IUserDocument) {
    const product = await this.productService.findById(doc.product);

    const review = await this.repository.findOne({
      user: user._id,
      product: doc.product,
    });

    if (review) {
      throw new UnauthorizedException('You have already reviewed this product');
    }

    product.ratingsQuantity++;
    product.ratingsAverage =
      (product.ratingsAverage * (product.ratingsQuantity - 1) + doc.rating) /
      product.ratingsQuantity;

    await product.save();

    return this.repository.create({
      ...doc,
      product: product._id,
      user: new Types.ObjectId(user._id),
    });
  }
}
