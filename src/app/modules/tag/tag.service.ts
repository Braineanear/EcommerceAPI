import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { TagRepository } from './repositories/tag.repository';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagService {
  constructor(
    protected readonly repository: TagRepository,
    protected readonly debuggerService: DebuggerService,
  ) {}

  async findById(id: string | Types.ObjectId) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Tag with id: ${id} not found`,
        'TagService',
        'findById',
      );

      throw new NotFoundException(`Tag with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('Tag not found', 'TagService', 'findOne');

      throw new NotFoundException('Tag not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error('Tags not found', 'TagService', 'find');

      throw new NotFoundException('Tags not found');
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
        `Tag with id: ${id} not found`,
        'TagService',
        'updateById',
      );

      throw new NotFoundException(`Tag with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Tag with id: ${id} not found`,
        'TagService',
        'deleteById',
      );

      throw new NotFoundException(`Tag with id: ${id} not found`);
    }

    return result;
  }

  async create(doc: CreateTagDto) {
    return this.repository.create(doc);
  }
}
