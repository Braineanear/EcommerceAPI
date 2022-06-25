import { Types } from 'mongoose';
import { IPaginateOptions } from './i-paginate-options';
import { IPaginatedInterface } from './i-paginate-result.interface';

export interface IBaseRepository<T> {
  create(doc: Partial<T>): Promise<T>;
  findOneById(id: string | Types.ObjectId, projection?: any): Promise<any>;
  findOne(filter: object): Promise<T>;
  find(filter: object): Promise<T[]>;
  updateOneById(id: string | Types.ObjectId, update: object): Promise<T>;
  updateOne(filter: object, update: object): Promise<T>;
  updateMany(filter: object, update: object): Promise<any>;
  deleteOneById(id: string | Types.ObjectId): Promise<T>;
  deleteOne(filter: object): Promise<T>;
  deleteMany(filter: object): Promise<any>;
  paginate(
    filter: object,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<T>>;
}
