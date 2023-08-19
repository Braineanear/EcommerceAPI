import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { History, HistorySchema } from './models/history.entity';
import { HistoryRepository } from './repositories/history.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
  providers: [HistoryService, HistoryRepository],
  controllers: [HistoryController],
  exports: [HistoryService, HistoryRepository],
})
export class HistoryModule {}
