import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';
import { ImageModule } from '@modules/image/image.module';
import { CategoryModule } from '@modules/category/category.module';
import { ColorModule } from '@modules/color/color.module';
import { SizeModule } from '@modules/size/size.module';
import { BrandModule } from '@modules/brand/brand.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './models/product.entity';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => ImageModule),
    forwardRef(() => AwsModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => ColorModule),
    forwardRef(() => SizeModule),
    forwardRef(() => BrandModule),
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
