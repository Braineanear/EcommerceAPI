import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { IBrandDocument } from '../interfaces/brand.interface';
import { Brand } from '../models/brand.entity';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { BaseRepository } from '@shared/repositories/base.repository';

@Injectable()
export class BrandRepository extends BaseRepository<IBrandDocument> {
  constructor(
    @InjectModel(Brand.name)
    protected readonly model: PaginateModel<IBrandDocument>,
  ) {
    super(model);
  }
}
