import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { Size, SizeSchema } from './models/size.entity';
import { SizeRepository } from './repositories/size.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Size.name, schema: SizeSchema }]),
  ],
  providers: [SizeService, SizeRepository],
  controllers: [SizeController],
  exports: [SizeService, SizeRepository],
})
export class SizeModule {}
