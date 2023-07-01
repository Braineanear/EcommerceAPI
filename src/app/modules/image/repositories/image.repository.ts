import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IImageDocument } from '../interfaces/image.interface';
import { Image } from '../models/image.entity';

@Injectable()
export class ImageRepository extends BaseRepository<IImageDocument> {
  constructor(
    @InjectModel(Image.name)
    protected readonly model: PaginateModel<IImageDocument>,
  ) {
    super(model);
  }
}
