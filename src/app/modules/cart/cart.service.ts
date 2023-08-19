import { Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ColorService } from '@modules/color/color.service';
import { ProductService } from '@modules/product/product.service';
import { SizeService } from '@modules/size/size.service';

import { DebuggerService } from '@shared/debugger/debugger.service';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateCartDto } from './dtos/create-cart.dto';
import { ProductCartDto } from './dtos/product-cart.dto';

import { CartRepository } from './repositories/cart.repository';

@Injectable()
export class CartService extends BaseService<CartRepository> {
  constructor(
    protected readonly repository: CartRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly productService: ProductService,
    protected readonly sizeService: SizeService,
    protected readonly colorService: ColorService,
  ) {
    super();
  }

  async addProductToCart(doc: CreateCartDto, user: string) {
    const cart = await this.repository.findOne({ user });

    const product = await this.productService.findById(doc.product);

    const { price, priceDiscount } = product;

    if (cart) {
      const indexFound = cart.items.findIndex(
        (item) => item.product.toString() === doc.product.toString(),
      );

      if (indexFound !== -1 && doc.quantity > 0) {
        cart.items[indexFound].quantity += doc.quantity;
        cart.items[indexFound].total += (price - priceDiscount) * doc.quantity;
        cart.totalQuantity += doc.quantity;
        cart.totalPrice += (price - priceDiscount) * doc.quantity;
      } else if (doc.quantity > 0) {
        cart.items.push({
          product: doc.product,
          quantity: doc.quantity,
          price: price - priceDiscount,
          total: (price - priceDiscount) * doc.quantity,
        });

        cart.totalQuantity += doc.quantity;
        cart.totalPrice += (price - priceDiscount) * doc.quantity;
      } else {
        throw new HttpException(MessagesMapping['#15'], HttpStatus.BAD_REQUEST);
      }

      await cart.save();

      return cart;
    }

    const cartData = {
      user: new Types.ObjectId(user),
      items: [
        {
          product: doc.product,
          quantity: doc.quantity,
          price: price - priceDiscount,
          total: (price - priceDiscount) * doc.quantity,
        },
      ],
      totalQuantity: doc.quantity,
      totalPrice: (price - priceDiscount) * doc.quantity,
    };

    const newCart = await this.repository.create(cartData);

    return newCart;
  }

  async reduceByOne(doc: ProductCartDto, user: string) {
    const cart = await this.repository.findOne({ user });
    const product = await this.productService.findById(doc.product);
    const { price, priceDiscount } = product;

    if (!cart) {
      throw new HttpException(MessagesMapping['#16'], HttpStatus.NOT_FOUND);
    }

    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === doc.product.toString()) a.push(i);
      return a;
    }, []);

    if (indexesFound.length === 0) {
      throw new HttpException(MessagesMapping['#17'], HttpStatus.NOT_FOUND);
    }

    for (const indexFound of indexesFound) {
      if (cart.items[indexFound].quantity === 1) {
        cart.items.splice(indexFound, 1);
        cart.totalQuantity -= 1;
        cart.totalPrice -= price - priceDiscount;
      } else {
        const updatedProductTotalQuantity = cart.items[indexFound].quantity - 1;
        const updatedProductTotalPrice =
          cart.items[indexFound].total - (price - priceDiscount);
        const updatedCartTotalQuantity = cart.totalQuantity - 1;
        const updatedCartTotalPrice = cart.totalPrice - (price - priceDiscount);

        cart.items[indexFound].quantity = updatedProductTotalQuantity;
        cart.items[indexFound].total = updatedProductTotalPrice;
        cart.totalQuantity = updatedCartTotalQuantity;
        cart.totalPrice = updatedCartTotalPrice;
      }
    }

    await cart.save();

    return await this.repository.findById(cart._id);
  }

  async increaseByOne(doc: ProductCartDto, user: string) {
    let cart = await this.repository.findOne({ user });
    const product = await this.productService.findById(doc.product);
    const { price, priceDiscount } = product;

    if (!cart) {
      throw new HttpException(MessagesMapping['#16'], HttpStatus.NOT_FOUND);
    }

    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === doc.product.toString()) a.push(i);
      return a;
    }, []);

    if (indexesFound.length === 0) {
      throw new HttpException(MessagesMapping['#17'], HttpStatus.NOT_FOUND);
    }

    for (const indexFound of indexesFound) {
      const updatedProductTotalQuantity = cart.items[indexFound].quantity + 1;
      const updatedProductTotalPrice =
        cart.items[indexFound].total + (price - priceDiscount);
      const updatedCartTotalQuantity = cart.totalQuantity + 1;
      const updatedCartTotalPrice = cart.totalPrice + (price - priceDiscount);

      if (updatedProductTotalQuantity <= 0 && updatedProductTotalPrice <= 0) {
        cart.items.splice(indexFound, 1);
      } else {
        cart.items[indexFound].quantity = updatedProductTotalQuantity;
        cart.items[indexFound].total = updatedProductTotalPrice;
        cart.totalQuantity = updatedCartTotalQuantity;
        cart.totalPrice = updatedCartTotalPrice;
      }
    }

    await cart.save();

    return await this.repository.findById(cart._id);
  }

  async deleteItemFromCart(doc: ProductCartDto, user: string) {
    const cart = await this.repository.findOne({ user });

    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === doc.product.toString()) a.push(i);
      return a;
    }, []);

    for (const indexFound of indexesFound) {
      const totalPrice = cart.totalPrice - cart.items[indexFound].total;
      const totalQuantity =
        cart.totalQuantity - cart.items[indexFound].quantity;

      await this.repository.updateOne(
        { user },
        {
          $pull: {
            items: {
              product: doc.product,
            },
          },
          totalPrice,
          totalQuantity,
        },
      );
    }

    return await this.repository.findById(cart._id);
  }

  async queryCart(user: string) {
    const cart = await this.repository.findOne({ user });

    if (!cart) {
      throw new HttpException(MessagesMapping['#16'], HttpStatus.NOT_FOUND);
    }

    return cart;
  }

  async deleteCart(user: string | Types.ObjectId) {
    const cart = await this.repository.findOne({ user });

    if (!cart) {
      throw new HttpException(MessagesMapping['#16'], HttpStatus.NOT_FOUND);
    }

    await this.repository.deleteOne({ user });

    return cart;
  }

  async cartProductCount(productId: string, user: string) {
    const cart = await this.repository.findOne({ user });

    if (!cart) {
      throw new HttpException(MessagesMapping['#16'], HttpStatus.NOT_FOUND);
    }

    const indexFound = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString(),
    );

    if (indexFound === -1) {
      return {
        count: 0,
      };
    }

    return {
      count: cart.items[indexFound].quantity,
    };
  }
}
