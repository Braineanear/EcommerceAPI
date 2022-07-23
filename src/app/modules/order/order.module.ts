import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '@modules/cart/cart.module';
import { ProductModule } from '@modules/product/product.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './models/order.entity';
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
