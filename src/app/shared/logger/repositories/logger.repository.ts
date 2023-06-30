import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ILoggerDocument } from '../interfaces/logger.interface';
import { Logger } from '../models/logger.entity';

@Injectable()
export class LoggerRepository {
  constructor(
    @InjectModel(Logger.name)
    private readonly model: PaginateModel<ILoggerDocument>,
  ) {}

  async create(doc: Partial<ILoggerDocument>): Promise<ILoggerDocument> {
    return this.model.create(doc);
  }
}
