import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, UpdateQuery, Types } from 'mongoose';
import Stripe from 'stripe';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { CartService } from '@modules/cart/cart.service';
import { ProductService } from '@modules/product/product.service';
import { OrderRepository } from './repositories/order.repository';
import { IOrderDocument } from './interfaces/order.interface';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import moment from 'moment';

@Injectable()
export class OrderService {
  constructor(
    protected readonly repository: OrderRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly cartService: CartService,
    protected readonly productService: ProductService,
    protected readonly configService: ConfigService,
  ) {}

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

    if (!cart || cart.items.length === 0) {
      this.debuggerService.error('Cart is empty', 'OrderService', 'create');

      throw new InternalServerErrorException('Cart is empty');
    }

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

  async findById(id: string | Types.ObjectId): Promise<IOrderDocument> {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Product with id: ${id} not found`,
        'ProductService',
        'findById',
      );

      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: FilterQuery<IOrderDocument>): Promise<IOrderDocument> {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error(
        'Product not found',
        'ProductService',
        'findOne',
      );

      throw new NotFoundException('Product not found');
    }

    return result;
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IOrderDocument>,
  ): Promise<IOrderDocument> {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `Product with id: ${id} not found`,
        'ProductService',
        'updateById',
      );

      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<void> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Product with id: ${id} not found`,
        'ProductService',
        'deleteById',
      );

      throw new NotFoundException(`Product with id: ${id} not found`);
    }
  }
}
