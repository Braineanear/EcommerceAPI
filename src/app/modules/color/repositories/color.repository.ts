import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Color, ColorDocument } from '../models/color.entity';

@Injectable()
export class ColorRepository extends BaseRepository<ColorDocument> {
  constructor(
    @InjectModel(Color.name)
    protected readonly model: PaginateModel<ColorDocument>,
  ) {
    super(model);
  }
}
