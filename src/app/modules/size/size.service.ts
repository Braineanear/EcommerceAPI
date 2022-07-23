import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { SizeRepository } from './repositories/size.repository';
import { CreateSizeDto } from './dtos/create-size.dto';

@Injectable()
export class SizeService {
  constructor(
    protected readonly repository: SizeRepository,
    protected readonly debuggerService: DebuggerService,
  ) {}

  async findById(id: string | Types.ObjectId) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Size with id: ${id} not found`,
        'SizeService',
        'findById',
      );

      throw new NotFoundException(`Size with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('Size not found', 'SizeService', 'findOne');

      throw new NotFoundException('Size not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error('Sizes not found', 'SizeService', 'find');

      throw new NotFoundException('Sizes not found');
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
        `Size with id: ${id} not found`,
        'SizeService',
        'updateById',
      );

      throw new NotFoundException(`Size with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Size with id: ${id} not found`,
        'SizeService',
        'deleteById',
      );

      throw new NotFoundException(`Size with id: ${id} not found`);
    }

    return result;
  }

  async create(doc: CreateSizeDto) {
    return this.repository.create(doc);
  }
}
