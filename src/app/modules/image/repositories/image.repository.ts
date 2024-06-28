import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Image, ImageDocument } from '../models/image.entity';

@Injectable()
export class ImageRepository extends BaseRepository<ImageDocument> {
  constructor(
    @InjectModel(Image.name)
    protected readonly model: PaginateModel<ImageDocument>,
  ) {
    super(model);
  }
}
