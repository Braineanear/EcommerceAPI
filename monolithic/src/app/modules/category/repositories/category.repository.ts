import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Category, CategoryDocument } from '../models/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    protected readonly model: PaginateModel<CategoryDocument>,
  ) {
    super(model);
  }
}
