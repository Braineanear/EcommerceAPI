import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { ITagDocument } from '../interfaces/tag.interface';
import { Tag } from '../models/tag.entity';

@Injectable()
export class TagRepository extends BaseRepository<ITagDocument> {
  constructor(
    @InjectModel(Tag.name)
    protected readonly model: PaginateModel<ITagDocument>,
  ) {
    super(model);
  }
}
