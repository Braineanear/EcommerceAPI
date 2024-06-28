import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { BrandRepository } from './repositories/brand.repository';
import { BrandDocument } from './models/brand.entity';

@Injectable()
export class BrandService extends BaseService<BrandDocument, BrandRepository> {
  constructor(protected readonly repository: BrandRepository) {
    super();
  }
}
