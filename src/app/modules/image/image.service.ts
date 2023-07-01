import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { ImageRepository } from './repositories/image.repository';

@Injectable()
export class ImageService extends BaseService<ImageRepository> {
  constructor(protected repository: ImageRepository) {
    super();
  }
}
