import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Brand, BrandDocument } from '../models/brand.entity';

@Injectable()
export class BrandRepository extends BaseRepository<BrandDocument> {
  constructor(
    @InjectModel(Brand.name)
    protected readonly model: PaginateModel<BrandDocument>,
  ) {
    super(model);
  }
}
