import { CartModule } from '@modules/cart/cart.module';
import { ProductModule } from '@modules/product/product.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from './models/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => CartModule),
    forwardRef(() => ProductModule),
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
