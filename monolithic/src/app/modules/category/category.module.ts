import { ImageModule } from '@modules/image/image.module';
import { UserModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './models/category.entity';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    forwardRef(() => ImageModule),
    forwardRef(() => AwsModule),
    forwardRef(() => UserModule),
  ],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
