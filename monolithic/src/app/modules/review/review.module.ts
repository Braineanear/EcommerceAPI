import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '@modules/product/product.module';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review, ReviewSchema } from './models/review.entity';
import { ReviewRepository } from './repositories/review.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    forwardRef(() => ProductModule),
  ],
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
  exports: [ReviewRepository, ReviewService],
})
export class ReviewModule {}
