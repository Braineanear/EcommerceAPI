import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';
import { BrandRepository } from './repositories/brand.repository';
import { CreateBrandDto } from './dtos/create-brand.dto';

@Injectable()
export class BrandService extends BaseService<BrandRepository> {
  constructor(protected readonly repository: BrandRepository) {
    super();
  }
}
