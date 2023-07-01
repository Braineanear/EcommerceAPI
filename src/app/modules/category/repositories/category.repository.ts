import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { ICategoryDocument } from '../interfaces/category.interface';
import { Category } from '../models/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<ICategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    protected readonly model: PaginateModel<ICategoryDocument>,
  ) {
    super(model);
  }
}
