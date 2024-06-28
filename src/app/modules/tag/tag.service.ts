import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { TagRepository } from './repositories/tag.repository';
import { TagDocument } from './models/tag.entity';

@Injectable()
export class TagService extends BaseService<TagDocument, TagRepository> {
  constructor(protected readonly repository: TagRepository) {
    super();
  }
}
