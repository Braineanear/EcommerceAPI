import { NotFoundException } from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { IBaseRepository } from '../interfaces/i-base-repository.interface';
import { IBaseService } from '../interfaces/i-base-service.interface';
import { IPaginateOptions } from '../interfaces/i-paginate-options';
import { DebuggerService } from '../debugger/debugger.service';

export abstract class BaseService<R extends IBaseRepository<Document>>
  implements IBaseService<Document>
{
  protected repository: R;
  protected debuggerService: DebuggerService;

  create(doc: Partial<any>, user?: any): Promise<any> {
    return this.repository.create(doc);
  }

  async findById(
    id: string | Types.ObjectId,
    projection: any = {},
  ): Promise<any> {
    const result = await this.repository.findById(id, projection);

    if (!result) {
      this.debuggerService.error(
        `Doc with id: ${id} not found`,
        'BaseService',
        'findById',
      );

      throw new NotFoundException('No data found');
    }

    return result;
  }
  async findOne(filter: object): Promise<any> {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('No data found', 'BaseService', 'findOne');

      throw new NotFoundException('No data found');
    }

    return result;
  }

  find(filter: object): Promise<any[]> {
    return this.repository.find(filter);
  }

  findPaginated(
    filter: object,
    paginateOptions: IPaginateOptions,
  ): Promise<any> {
    return this.repository.paginate(filter, paginateOptions);
  }

  async updateById(id: string | Types.ObjectId, update: object): Promise<any> {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `Doc with id: ${id} not found`,
        'BaseService',
        'updateById',
      );

      throw new NotFoundException('No data found');
    }

    return result;
  }

  async updateOne(filter: object, update: object): Promise<any> {
    const result = await this.repository.updateOne(filter, update);

    if (!result) {
      this.debuggerService.error('No data found', 'BaseService', 'updateOne');

      throw new NotFoundException('No data found');
    }

    return result;
  }

  async updateMany(filter: object, update: object): Promise<any> {
    const result = await this.repository.updateMany(filter, update);

    if (!result) {
      this.debuggerService.error('No data found', 'BaseService', 'updateMany');

      throw new NotFoundException('No data found');
    }

    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<any> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Doc with id: ${id} not found`,
        'BaseService',
        'deleteById',
      );

      throw new NotFoundException('No data found');
    }

    return result;
  }

  async deleteOne(filter: object): Promise<any> {
    const result = await this.repository.deleteOne(filter);

    if (!result) {
      this.debuggerService.error('No data found', 'BaseService', 'deleteOne');

      throw new NotFoundException('No data found');
    }

    return result;
  }

  async deleteMany(filter: object): Promise<any> {
    const result = await this.repository.deleteMany(filter);

    if (!result) {
      this.debuggerService.error('No data found', 'BaseService', 'deleteMany');

      throw new NotFoundException('No data found');
    }

    return result;
  }
}
