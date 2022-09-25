import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import moment from 'moment';
import { BaseService } from '@shared/services/base.service';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { CartService } from '@modules/cart/cart.service';
import { ProductService } from '@modules/product/product.service';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { OrderRepository } from './repositories/order.repository';
import { IOrderDocument } from './interfaces/order.interface';

@Injectable()
export class OrderService extends BaseService<OrderRepository> {
  constructor(
    protected readonly repository: OrderRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly cartService: CartService,
    protected readonly productService: ProductService,
    protected readonly configService: ConfigService,
  ) {
    super();
  }

  async create(
    createProductDto: any,
    user: IUserDocument,
  ): Promise<IOrderDocument> {
    const {
      shippingAddress,
      paymentMethod,
      phone,
      cardNumber,
      expMonth,
      expYear,
      cvc,
    } = createProductDto;

    const cart = await this.cartService.findOne({ email: user.email });

    if (paymentMethod === 'cash') {
      const order = await this.repository.create({
        products: cart.items,
        user: user._id,
        totalPrice: cart.totalPrice,
        shippingAddress,
        paymentMethod,
        phone,
      });

      for (const item of cart.items) {
        const product = await this.productService.findById(item.product);

        product.sold = product.sold + item.quantity;
        product.quantity = product.quantity - item.quantity;

        await product.save();
      }

      user.discountCode = '';

      await user.save();

      return order;
    }

    if (!cardNumber || !expMonth || !expYear || !cvc) {
      this.debuggerService.error(
        'Card details are missing',
        'OrderService',
        'create',
      );

      throw new InternalServerErrorException('Card details are missing');
    }

    const stripe = new Stripe(this.configService.get('app.strip_key'), {
      apiVersion: '2020-08-27',
    });

    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      },
    });

    const charge = await stripe.charges.create({
      amount: Math.round(cart.totalPrice),
      currency: 'usd',
      source: token.id,
      description: 'Charge For Products',
    });

    const order = await this.repository.create({
      products: cart.items,
      user: user._id,
      totalPrice: cart.totalPrice,
      isPaid: true,
      paidAt: moment().toDate(),
      shippingAddress,
      paymentMethod,
      paymentStripeId: charge.id,
      phone,
    });

    for (const item of cart.items) {
      const product = await this.productService.findById(item.product);
      const sold = product.sold + item.quantity;
      const quantity = product.quantity - item.quantity;
      await this.productService.updateById(item.product, { sold, quantity });
    }

    await this.cartService.deleteById(cart._id);

    user.discountCode = '';
    await user.save();

    return order;
  }
}
