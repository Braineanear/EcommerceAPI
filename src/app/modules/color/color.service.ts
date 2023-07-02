import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { ColorRepository } from './repositories/color.repository';

@Injectable()
export class ColorService extends BaseService<ColorRepository> {
  constructor(protected readonly repository: ColorRepository) {
    super();
  }
}
