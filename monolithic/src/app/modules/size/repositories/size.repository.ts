import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Size, SizeDocument } from '../models/size.entity';

@Injectable()
export class SizeRepository extends BaseRepository<SizeDocument> {
  constructor(
    @InjectModel(Size.name)
    protected readonly model: PaginateModel<SizeDocument>,
  ) {
    super(model);
  }
}
