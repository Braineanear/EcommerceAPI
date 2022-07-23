import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { ImageRepository } from './repositories/image.repository';
import { CreateImageDto } from './dtos/create-image.dto';

@Injectable()
export class ImageService {
  constructor(
    protected repository: ImageRepository,
    protected debuggerService: DebuggerService,
  ) {}

  async findById(id: string | Types.ObjectId) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Image with id ${id} not found`,
        'ImageService',
        'findById',
      );

      throw new NotFoundException(`Image with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('Image not found', 'ImageService', 'findOne');

      throw new NotFoundException('Image not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error('Images not found', 'ImageService', 'find');

      throw new NotFoundException('Images not found');
    }

    return results;
  }

  async findPaginated(filter: object, paginateOptions) {
    return this.repository.findPaginated(filter, paginateOptions);
  }

  async updateById(id: string | Types.ObjectId, update: object) {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `Image with id: ${id} not found`,
        'ImageService',
        'updateById',
      );

      throw new NotFoundException(`Image with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string | Types.ObjectId) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Image with id: ${id} not found`,
        'ImageService',
        'deleteById',
      );

      throw new NotFoundException(`Image with id: ${id} not found`);
    }

    return result;
  }

  async create(doc: CreateImageDto) {
    return this.repository.create(doc);
  }
}
