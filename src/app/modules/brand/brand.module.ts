import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand, BrandSchema } from './models/brand.entity';
import { BrandRepository } from './repositories/brand.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  providers: [BrandService, BrandRepository],
  controllers: [BrandController],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
