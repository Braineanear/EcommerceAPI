import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Tag, TagDocument } from '../models/tag.entity';

@Injectable()
export class TagRepository extends BaseRepository<TagDocument> {
  constructor(
    @InjectModel(Tag.name)
    protected readonly model: PaginateModel<TagDocument>,
  ) {
    super(model);
  }
}
