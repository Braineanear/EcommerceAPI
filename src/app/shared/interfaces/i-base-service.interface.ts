import { Types } from 'mongoose';

export interface IBaseService {
  create(doc: Partial<any>): Promise<any>;
  findOneById(id: string | Types.ObjectId): Promise<any>;
  findOne(filter: object): Promise<any>;
  find(filter: object): Promise<any[]>;
  updateOneById(id: string | Types.ObjectId, update: object): Promise<any>;
  updateOne(filter: object, update: object): Promise<any>;
  updateMany(filter: object, update: object): Promise<any>;
  deleteOneById(id: string | Types.ObjectId): Promise<any>;
  deleteOne(filter: object): Promise<any>;
  deleteMany(filter: object): Promise<any>;
}
