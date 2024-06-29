import { PartialType } from '@nestjs/swagger';
import { Review } from '../models/review.entity';

export class ReviewDto extends PartialType(Review) {}
