import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { ISizeDocument } from '../interfaces/size.interface';
import { Size } from '../models/size.entity';

@Injectable()
export class SizeRepository extends BaseRepository<ISizeDocument> {
  constructor(
    @InjectModel(Size.name)
    protected readonly model: PaginateModel<ISizeDocument>,
  ) {
    super(model);
  }
}
