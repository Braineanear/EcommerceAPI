import { Types } from 'mongoose';
import Stripe from 'stripe';

import { CartService } from '@modules/cart/cart.service';
import { ICartDocument } from '@modules/cart/interfaces/cart.interface';
import { ProductService } from '@modules/product/product.service';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateOrderDTO } from './dtos/create-order.dto';
import { IOrderDocument } from './interfaces/order.interface';
import { OrderRepository } from './repositories/order.repository';

@Injectable()
export class OrderService extends BaseService<OrderRepository> {
  private stripe: Stripe;
  private stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

  constructor(
    protected readonly repository: OrderRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly cartService: CartService,
    protected readonly productService: ProductService,
    protected readonly configService: ConfigService,
  ) {
    super();

    this.stripe = new Stripe(this.stripeSecretKey, {
      apiVersion: '2022-11-15',
    });
  }

  private async cachePayment(
    createOrderDTO: CreateOrderDTO,
    cart: ICartDocument,
    userID: Types.ObjectId | string,
  ) {
    const {
      paymentMethod,
      phone,
      address,
      city,
      country,
      postalCode,
      status,
      taxPrice,
      shippingPrice,
    } = createOrderDTO;

    const order = await this.repository.create({
      products: cart.items,
      user: userID,
      totalPrice: cart.totalPrice,
      address,
      city,
      country,
      postalCode,
      paymentMethod,
      phone,
      status,
      taxPrice,
      shippingPrice,
    });

    for (const item of cart.items) {
      const id = item.product;
      const { total } = item;
      const product = await this.productService.findById(id);
      const sold = product.sold + total;
      const quantity = product.quantity - total;

      await this.productService.updateById(id, { sold, quantity });
    }

    await this.cartService.deleteCart(userID);

    return order;
  }

  private async stripePayment(
    createOrderDTO: CreateOrderDTO,
    cart: ICartDocument,
    userID: Types.ObjectId | string,
  ) {
    const {
      cardNumber,
      expMonth,
      expYear,
      cvc,
      address,
      city,
      country,
      postalCode,
      paymentMethod,
      phone,
      status,
      taxPrice,
      shippingPrice,
    } = createOrderDTO;

    const token = await this.stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      },
    });

    const charge = await this.stripe.charges.create({
      amount: Math.round(cart.totalPrice),
      currency: 'usd',
      source: token.id,
      description: 'Charge For Products',
    });

    const order = await this.repository.create({
      products: cart.items,
      user: userID,
      totalPrice: cart.totalPrice,
      isPaid: true,
      address,
      city,
      country,
      postalCode,
      paymentMethod,
      paymentStripeId: charge.id,
      phone,
      status,
      taxPrice,
      shippingPrice,
    });

    for (const item of cart.items) {
      const id = item.product;
      const product = await this.productService.findById(id);
      const sold = product.sold + item.quantity;
      const quantity = product.quantity - item.quantity;
      await this.productService.updateById(id, { sold, quantity });
    }

    await this.cartService.deleteOne({
      user: userID,
    });

    return order;
  }

  public async create(
    createOrderDTO: CreateOrderDTO,
    userId: string,
  ): Promise<IOrderDocument> {
    const { paymentMethod } = createOrderDTO;
    const cart = await this.cartService.findOne({ user: userId });

    if (cart.items.length === 0) {
      throw new HttpException(MessagesMapping['#16'], HttpStatus.NOT_FOUND);
    }

    const order =
      paymentMethod === 'cash'
        ? await this.cachePayment(createOrderDTO, cart, userId)
        : await this.stripePayment(createOrderDTO, cart, userId);

    return order;
  }

  public async changeOrderStatus(id: Types.ObjectId | string, status: string) {
    if (
      ![
        'Not Processed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ].includes(status)
    ) {
      throw new HttpException(MessagesMapping['#26'], HttpStatus.BAD_REQUEST);
    }

    const order = await this.findById(id);

    if (status === 'Cancelled') {
      for (const item of order.products) {
        const product = await this.productService.findById(item.product);

        await this.productService.updateById(item.product, {
          quantity: product.quantity + item.totalProductQuantity,
          sold: product.sold - item.totalProductQuantity,
        });
      }

      await this.deleteById(id);

      return {
        type: 'Success',
        message: 'successfulOrderCancel',
        statusCode: 200,
      };
    }

    order.status = status;

    await order.save();

    return {
      type: 'Success',
      message: 'successfulStatusUpdate',
      statusCode: 200,
    };
  }

  async getOrders(user: IUserDocument) {
    if (user.role === 'Admin' || user.role === 'SuperAdmin') {
      const orders = await this.findPaginated({}, {});

      return {
        type: 'Success',
        message: 'successfulOrdersFound',
        statusCode: 200,
        orders,
      };
    }

    const orders = await this.find({ user: user._id });

    return {
      type: 'Success',
      message: 'successfulOrdersFound',
      statusCode: 200,
      orders,
    };
  }

  async getOrder(user: IUserDocument, id: Types.ObjectId | string) {
    if (user.role === 'Admin' || user.role === 'SuperAdmin') {
      const orders = await this.findById(id);

      return {
        type: 'Success',
        message: 'successfulOrdersFound',
        statusCode: 200,
        orders,
      };
    }
    const order = await this.findById(id);

    return {
      type: 'Success',
      message: 'successfulOrderFound',
      statusCode: 200,
      order,
    };
  }

  async cancelOrder(user: IUserDocument, id: Types.ObjectId | string) {
    const order = await this.findById(id);

    if (
      user._id.toString() !== order.user.toString() &&
      user.role !== 'Admin' &&
      user.role !== 'SuperAdmin'
    ) {
      throw new HttpException(MessagesMapping['#24'], HttpStatus.BAD_REQUEST);
    }

    for (const item of order.products) {
      const product = await this.productService.findById(item.product);

      await this.productService.updateById(item.product, {
        quantity: product.quantity + item.quantity,
        sold: product.sold - item.quantity,
      });
    }

    await this.deleteById(id);

    return {
      type: 'Success',
      message: 'successfulOrderCancel',
      statusCode: 200,
    };
  }
}
