import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { Token, TokenDocument } from '../models/token.entity';

@Injectable()
export class TokenRepository extends BaseRepository<TokenDocument> {
  constructor(
    @InjectModel(Token.name)
    protected readonly model: PaginateModel<TokenDocument>,
  ) {
    super(model);
  }
}
