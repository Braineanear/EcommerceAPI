import { Types } from 'mongoose';

import { ProductService } from '@modules/product/product.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { MessagesMapping } from '@shared/messages-mapping';
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
  async updateReview(id: string, update: object, userId: string) {
    const review = await this.findById(id);

    if (review.user.toString() !== userId) {
      throw new HttpException(MessagesMapping['#24'], HttpStatus.UNAUTHORIZED);
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

  async deleteReview(id: string, userId: string) {
    const review = await this.findById(id);

    if (review.user.toString() !== userId) {
      throw new HttpException(MessagesMapping['#24'], HttpStatus.UNAUTHORIZED);
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

  async create(doc: CreateReviewDto, userId: string) {
    const product = await this.productService.findById(doc.product);

    const review = await this.repository.findOne({
      user: userId,
      product: doc.product,
    });

    if (review) {
      throw new HttpException(MessagesMapping['#25'], HttpStatus.UNAUTHORIZED);
    }

    product.ratingsQuantity++;
    product.ratingsAverage =
      (product.ratingsAverage * (product.ratingsQuantity - 1) + doc.rating) /
      product.ratingsQuantity;

    await product.save();

    return this.repository.create({
      ...doc,
      product: product._id,
      user: new Types.ObjectId(userId),
    });
  }
}
