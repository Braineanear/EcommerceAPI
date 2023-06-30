import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IUserDocument } from '../interfaces/user.interface';
import { User } from '../models/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<IUserDocument> {
  constructor(
    @InjectModel(User.name)
    protected readonly model: PaginateModel<IUserDocument>,
  ) {
    super(model);
  }
}
