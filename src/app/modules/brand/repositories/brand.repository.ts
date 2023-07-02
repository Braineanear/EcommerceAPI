import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IBrandDocument } from '../interfaces/brand.interface';
import { Brand } from '../models/brand.entity';

@Injectable()
export class BrandRepository extends BaseRepository<IBrandDocument> {
  constructor(
    @InjectModel(Brand.name)
    protected readonly model: PaginateModel<IBrandDocument>,
  ) {
    super(model);
  }
}
