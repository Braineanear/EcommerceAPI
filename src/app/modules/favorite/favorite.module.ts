import { ProductModule } from '@modules/product/product.module';
import { SizeModule } from '@modules/size/size.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { Favorite, FavoriteSchema } from './models/favorite.entity';
import { FavoriteRepository } from './repositories/favorite.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
    forwardRef(() => ProductModule),
  ],
  providers: [FavoriteService, FavoriteRepository],
  controllers: [FavoriteController],
  exports: [FavoriteService, FavoriteRepository],
})
export class FavoriteModule {}
