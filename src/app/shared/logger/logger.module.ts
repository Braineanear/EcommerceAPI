import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggerService } from './logger.service';
import { Logger, LoggerSchema } from './models/logger.entity';
import { LoggerRepository } from './repositories/logger.repository';

@Global()
@Module({
  providers: [LoggerService, LoggerRepository],
  exports: [LoggerService],
  imports: [
    MongooseModule.forFeature([{ name: Logger.name, schema: LoggerSchema }]),
  ],
})
export class LoggerModule {}
