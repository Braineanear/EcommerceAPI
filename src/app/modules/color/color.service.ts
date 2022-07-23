import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { ColorRepository } from './repositories/color.repository';
import { CreateColorDto } from './dtos/create-color.dto';

@Injectable()
export class ColorService {
  constructor(
    protected readonly repository: ColorRepository,
    protected readonly debuggerService: DebuggerService,
  ) {}

  async findById(id: string | Types.ObjectId) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Color with id: ${id} not found`,
        'ColorService',
        'findById',
      );

      throw new NotFoundException(`Color with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('Color not found', 'ColorService', 'findOne');

      throw new NotFoundException('Color not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error('Colors not found', 'ColorService', 'find');

      throw new NotFoundException('Colors not found');
    }

    return results;
  }

  async findPaginated(filter: object, paginateOptions) {
    return this.repository.findPaginated(filter, paginateOptions);
  }

  async updateById(id: string, update: object) {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `Color with id: ${id} not found`,
        'ColorService',
        'updateById',
      );

      throw new NotFoundException(`Color with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Color with id: ${id} not found`,
        'ColorService',
        'deleteById',
      );

      throw new NotFoundException(`Color with id: ${id} not found`);
    }

    return result;
  }

  async create(doc: CreateColorDto) {
    return this.repository.create(doc);
  }
}
