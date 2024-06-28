import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { SizeRepository } from './repositories/size.repository';
import { SizeDocument } from './models/size.entity';

@Injectable()
export class SizeService extends BaseService<SizeDocument, SizeRepository> {
  constructor(protected readonly repository: SizeRepository) {
    super();
  }
}
