import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { ITokenDocument } from '../interfaces/token.interface';
import { Token } from '../models/token.entity';

@Injectable()
export class TokenRepository extends BaseRepository<ITokenDocument> {
  constructor(
    @InjectModel(Token.name)
    protected readonly model: PaginateModel<ITokenDocument>,
  ) {
    super(model);
  }
}
