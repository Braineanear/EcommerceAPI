import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Favorite, FavoriteDocument } from '../models/favorite.entity';

@Injectable()
export class FavoriteRepository extends BaseRepository<FavoriteDocument> {
  constructor(
    @InjectModel(Favorite.name)
    protected readonly model: PaginateModel<FavoriteDocument>,
  ) {
    super(model);
  }
}
