import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag, TagSchema } from './models/tag.entity';
import { TagRepository } from './repositories/tag.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  providers: [TagService, TagRepository],
  controllers: [TagController],
  exports: [TagService, TagRepository],
})
export class TagModule {}
