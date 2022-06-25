import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Image, ImageSchema } from './models/image.entity';
import { ImageRepository } from './repositories/image.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  providers: [ImageService, ImageRepository],
  controllers: [ImageController],
  exports: [ImageService, ImageRepository],
})
export class ImageModule {}
