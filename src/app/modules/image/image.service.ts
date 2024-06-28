import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { ImageRepository } from './repositories/image.repository';
import { ImageDocument } from './models/image.entity';

@Injectable()
export class ImageService extends BaseService<ImageDocument, ImageRepository> {
  constructor(protected repository: ImageRepository) {
    super();
  }
}
