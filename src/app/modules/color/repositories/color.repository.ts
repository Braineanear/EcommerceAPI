import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IColorDocument } from '../interfaces/color.interface';
import { Color } from '../models/color.entity';

@Injectable()
export class ColorRepository extends BaseRepository<IColorDocument> {
  constructor(
    @InjectModel(Color.name)
    protected readonly model: PaginateModel<IColorDocument>,
  ) {
    super(model);
  }
}
