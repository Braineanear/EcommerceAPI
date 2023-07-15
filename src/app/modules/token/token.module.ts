import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Token, TokenSchema } from './models/token.entity';
import { TokenRepository } from './repositories/token.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [TokenRepository],
  controllers: [],
  exports: [TokenRepository],
})
export class TokenModule {}
