import { Document, Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MessagesMapping } from '@shared/messages-mapping';
import { DebuggerService } from '../debugger/debugger.service';
import { IBaseRepository } from '../interfaces/i-base-repository.interface';
import { IBaseService } from '../interfaces/i-base-service.interface';
import { IPaginateOptions } from '../interfaces/i-paginate-options';

export abstract class BaseService<
  T extends Document,
  R extends IBaseRepository<T>
> implements IBaseService<T> {
  protected repository: R;
  protected debuggerService: DebuggerService;

  async create(doc: Partial<T>, user?: any): Promise<T> {
    return this.repository.create(doc);
  }

  async findById(id: string | Types.ObjectId): Promise<T> {
    const result = await this.repository.findById(id);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  async findOne(filter: object): Promise<T> {
    const result = await this.repository.findOne(filter);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  async find(filter: object): Promise<T[]> {
    return this.repository.find(filter);
  }

  async findPaginated(
    filter: object,
    paginateOptions: IPaginateOptions,
  ): Promise<any> {
    return this.repository.paginate(filter, paginateOptions);
  }

  async updateById(id: string | Types.ObjectId, update: object): Promise<T> {
    const result = await this.repository.updateById(id, update);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  async updateOne(filter: object, update: object): Promise<T> {
    const result = await this.repository.updateOne(filter, update);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  async updateMany(filter: object, update: object): Promise<any> {
    const result = await this.repository.updateMany(filter, update);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<T> {
    const result = await this.repository.deleteById(id);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  async deleteOne(filter: object): Promise<T> {
    const result = await this.repository.deleteOne(filter);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  async deleteMany(filter: object): Promise<any> {
    const result = await this.repository.deleteMany(filter);
    if (!result) {
      this.throwNotFound();
    }
    return result;
  }

  private throwNotFound(): void {
    throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
  }
}
