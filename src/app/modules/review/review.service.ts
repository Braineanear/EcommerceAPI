import { Injectable, NotFoundException } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { ProductService } from '@modules/product/product.service';
import { ReviewRepository } from './repositories/review.repository';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Types } from 'mongoose';

@Injectable()
export class ReviewService {
  constructor(
    protected readonly repository: ReviewRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly productService: ProductService,
  ) {}

  async findById(id: string) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Review with id: ${id} not found`,
        'ReviewService',
        'findById',
      );

      throw new NotFoundException(`Review with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error(
        'Review not found',
        'ReviewService',
        'findOne',
      );

      throw new NotFoundException('Review not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error('Reviews not found', 'ReviewService', 'find');

      throw new NotFoundException('Reviews not found');
    }

    return results;
  }

  async findPaginated(filter: object, paginateOptions) {
    return this.repository.findPaginated(filter, paginateOptions);
  }

  async updateById(id: string, update: object) {
    const review = await this.repository.findById(id);

    if (!review) {
      this.debuggerService.error(
        `Review with id: ${id} not found`,
        'ReviewService',
        'deleteById',
      );

      throw new NotFoundException(`Review with id: ${id} not found`);
    }

    const stats = await this.repository.aggregate([
      {
        $match: { product: review.product },
      },
      {
        $group: {
          _id: '$product',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    if (stats.length > 0) {
      await this.productService.updateById(review.product, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await this.productService.updateById(review.product, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      });
    }

    return await this.repository.updateById(id, update);
  }

  async deleteById(id: string) {
    const review = await this.repository.findById(id);

    if (!review) {
      this.debuggerService.error(
        `Review with id: ${id} not found`,
        'ReviewService',
        'deleteById',
      );

      throw new NotFoundException(`Review with id: ${id} not found`);
    }

    const stats = await this.repository.aggregate([
      {
        $match: { product: review.product },
      },
      {
        $group: {
          _id: '$product',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    if (stats.length > 0) {
      await this.productService.updateById(review.product, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await this.productService.updateById(review.product, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      });
    }

    return await this.repository.deleteById(id);
  }

  async create(doc: CreateReviewDto, userID: Types.ObjectId) {
    const product = await this.productService.findById(doc.product);

    const stats = await this.repository.aggregate([
      {
        $match: { product: product._id },
      },
      {
        $group: {
          _id: '$product',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    if (stats.length > 0) {
      await this.productService.updateById(product._id, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await this.productService.updateById(product._id, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      });
    }

    return this.repository.create({
      ...doc,
      product: product._id,
      user: userID,
    });
  }
}
