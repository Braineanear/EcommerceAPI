import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IHistoryDocument } from '../interfaces/history.interface';
import { History } from '../models/history.entity';

@Injectable()
export class HistoryRepository extends BaseRepository<IHistoryDocument> {
  constructor(
    @InjectModel(History.name)
    protected readonly model: PaginateModel<IHistoryDocument>,
  ) {
    super(model);
  }
}
