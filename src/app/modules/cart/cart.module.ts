import { ColorModule } from '@modules/color/color.module';
import { ProductModule } from '@modules/product/product.module';
import { SizeModule } from '@modules/size/size.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './models/cart.entity';
import { CartRepository } from './repositories/cart.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    forwardRef(() => ColorModule),
    forwardRef(() => SizeModule),
    forwardRef(() => ProductModule),
  ],
  providers: [CartService, CartRepository],
  controllers: [CartController],
  exports: [CartService, CartRepository],
})
export class CartModule {}
