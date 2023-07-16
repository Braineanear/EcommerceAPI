import { Document, Types } from 'mongoose';

import { HttpException, HttpStatus } from '@nestjs/common';
import { MessagesMapping } from '@shared/messages-mapping';

import { DebuggerService } from '../debugger/debugger.service';
import { IBaseRepository } from '../interfaces/i-base-repository.interface';
import { IBaseService } from '../interfaces/i-base-service.interface';
import { IPaginateOptions } from '../interfaces/i-paginate-options';

export abstract class BaseService<R extends IBaseRepository<Document>>
  implements IBaseService<Document>
{
  protected repository: R;
  protected debuggerService: DebuggerService;

  create(doc: Partial<any>, user?: any): Promise<any> {
    return this.repository.create(doc);
  }

  async findById(id: string | Types.ObjectId): Promise<any> {
    const result = await this.repository.findById(id);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return result;
  }
  async findOne(filter: object): Promise<any> {
    const result = await this.repository.findOne(filter);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
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
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateOne(filter: object, update: object): Promise<any> {
    const result = await this.repository.updateOne(filter, update);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateMany(filter: object, update: object): Promise<any> {
    const result = await this.repository.updateMany(filter, update);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<any> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async deleteOne(filter: object): Promise<any> {
    const result = await this.repository.deleteOne(filter);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async deleteMany(filter: object): Promise<any> {
    const result = await this.repository.deleteMany(filter);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
