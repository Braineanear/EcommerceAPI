import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './models/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { ImageModule } from '@modules/image/image.module';
import { AwsModule } from '@shared/aws/aws.module';
import { UserModule } from '@modules/user/user.module';
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
