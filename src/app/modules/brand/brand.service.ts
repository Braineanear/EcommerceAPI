import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { BrandRepository } from './repositories/brand.repository';
import { CreateBrandDto } from './dtos/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    protected readonly repository: BrandRepository,
    protected readonly debuggerService: DebuggerService,
  ) {}

  async findById(id: string) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Brand with id: ${id} not found`,
        'BrandService',
        'findById',
      );

      throw new NotFoundException(`Brand with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('Brand not found', 'BrandService', 'findOne');

      throw new NotFoundException('Brand not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error('Brands not found', 'BrandService', 'find');

      throw new NotFoundException('Brands not found');
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
        `Brand with id: ${id} not found`,
        'BrandService',
        'updateById',
      );

      throw new NotFoundException(`Brand with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Brand with id: ${id} not found`,
        'BrandService',
        'deleteById',
      );

      throw new NotFoundException(`Brand with id: ${id} not found`);
    }

    return result;
  }

  async create(doc: CreateBrandDto) {
    return this.repository.create(doc);
  }
}
