import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { SizeRepository } from './repositories/size.repository';

@Injectable()
export class SizeService extends BaseService<SizeRepository> {
  constructor(protected readonly repository: SizeRepository) {
    super();
  }
}
