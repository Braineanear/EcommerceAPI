import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { TagRepository } from './repositories/tag.repository';

@Injectable()
export class TagService extends BaseService<TagRepository> {
  constructor(protected readonly repository: TagRepository) {
    super();
  }
}
