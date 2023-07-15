import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IFavoriteDocument } from '../interfaces/favorite.interface';
import { Favorite } from '../models/favorite.entity';

@Injectable()
export class FavoriteRepository extends BaseRepository<IFavoriteDocument> {
  constructor(
    @InjectModel(Favorite.name)
    protected readonly model: PaginateModel<IFavoriteDocument>,
  ) {
    super(model);
  }
}
