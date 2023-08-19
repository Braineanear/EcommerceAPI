import { BrandModule } from '@modules/brand/brand.module';
import { CategoryModule } from '@modules/category/category.module';
import { ColorModule } from '@modules/color/color.module';
import { ImageModule } from '@modules/image/image.module';
import { SizeModule } from '@modules/size/size.module';
import { TagModule } from '@modules/tag/tag.module';
import { UserModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';

import { Product, ProductSchema } from './models/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { HistoryModule } from '@modules/history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => ImageModule),
    forwardRef(() => AwsModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => ColorModule),
    forwardRef(() => SizeModule),
    forwardRef(() => BrandModule),
    forwardRef(() => TagModule),
    forwardRef(() => UserModule),
    forwardRef(() => HistoryModule),
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
