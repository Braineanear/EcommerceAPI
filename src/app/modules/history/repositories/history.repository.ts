import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { History, HistoryDocument } from '../models/history.entity';

@Injectable()
export class HistoryRepository extends BaseRepository<HistoryDocument> {
  constructor(
    @InjectModel(History.name)
    protected readonly model: PaginateModel<HistoryDocument>,
  ) {
    super(model);
  }
}
