import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Tag, TagSchema } from './models/tag.entity';
import { TagRepository } from './repositories/tag.repository';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  providers: [TagService, TagRepository],
  controllers: [TagController],
  exports: [TagService, TagRepository],
})
export class TagModule {}
