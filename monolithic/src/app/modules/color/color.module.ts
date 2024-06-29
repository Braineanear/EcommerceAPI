import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { Color, ColorSchema } from './models/color.entity';
import { ColorRepository } from './repositories/color.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }]),
  ],
  providers: [ColorService, ColorRepository],
  controllers: [ColorController],
  exports: [ColorService, ColorRepository],
})
export class ColorModule {}
