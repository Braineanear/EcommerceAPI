import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { ColorRepository } from './repositories/color.repository';
import { ColorDocument } from './models/color.entity';

@Injectable()
export class ColorService extends BaseService<ColorDocument, ColorRepository> {
  constructor(protected readonly repository: ColorRepository) {
    super();
  }
}
