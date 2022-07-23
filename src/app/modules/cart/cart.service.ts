import { Injectable, NotFoundException } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { ProductService } from '@modules/product/product.service';
import { SizeService } from '@modules/size/size.service';
import { ColorService } from '@modules/color/color.service';
import { CartRepository } from './repositories/cart.repository';
import { CreateCartDto } from './dtos/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    protected readonly repository: CartRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly productService: ProductService,
    protected readonly sizeService: SizeService,
    protected readonly colorService: ColorService,
  ) {}

  async findById(id: string) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Cart with id: ${id} not found`,
        'CartService',
        'findById',
      );

      throw new NotFoundException(`Cart with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('Cart not found', 'CartService', 'findOne');

      throw new NotFoundException('Cart not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error('Categories not found', 'CartService', 'find');

      throw new NotFoundException('Categories not found');
    }

    return results;
  }

  async findPaginated(filter: object, paginateOptions) {
    return this.repository.findPaginated(filter, paginateOptions);
  }

  async updateById(id: string, update: object) {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `Cart with id: ${id} not found`,
        'CartService',
        'updateById',
      );

      throw new NotFoundException(`Cart with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Cart with id: ${id} not found`,
        'CartService',
        'deleteById',
      );

      throw new NotFoundException(`Cart with id: ${id} not found`);
    }

    return result;
  }

  async addProductToCart(doc: CreateCartDto) {
    const cart = await this.repository.findOne({
      email: doc.email,
    });

    const product = await this.productService.findById(doc.product);

    const { price, priceDiscount } = product;

    if (cart) {
      const indexFound = cart.items.findIndex(
        (item) => item.product.toString() === doc.product.toString(),
      );

      if (indexFound !== -1 && doc.quantity <= 0) {
        cart.items.splice(indexFound, 1);
      } else if (
        indexFound !== -1 &&
        cart.items[indexFound].selectedColor.toString() ===
          doc.color.toString() &&
        cart.items[indexFound].selectedSize.toString() === doc.size.toString()
      ) {
        cart.items[indexFound].quantity += doc.quantity;
        cart.items[indexFound].total += (price - priceDiscount) * doc.quantity;
        cart.totalQuantity += doc.quantity;
        cart.totalPrice += (price - priceDiscount) * doc.quantity;
      } else if (doc.quantity > 0) {
        // In case product doesn't exist & there is other products in the cart
        // then push the new product to the items array in the cart
        // Update totalQuantity & totalPrice
        cart.items.push({
          product: doc.product,
          selectedColor: doc.color,
          selectedSize: doc.size,
          quantity: doc.quantity,
          price: price - priceDiscount,
          total: (price - priceDiscount) * doc.quantity,
        });

        cart.totalQuantity += doc.quantity;
        cart.totalPrice += (price - priceDiscount) * doc.quantity;
      } else {
        this.debuggerService.error(
          `Invalid request`,
          'CartService',
          'addProductToCart',
        );

        throw new NotFoundException(`Invalid request`);
      }

      await cart.save();

      return cart;
    }

    const cartData = {
      email: doc.email,
      items: [
        {
          product: doc.product,
          selectedColor: doc.color,
          selectedSize: doc.size,
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

  async reduceByOne(doc: CreateCartDto) {
    const cart = await this.repository.findOne({
      email: doc.email,
    });
    const product = await this.productService.findById(doc.product);
    const { price, priceDiscount } = product;

    if (!cart) {
      this.debuggerService.error(
        `Cart with email: ${doc.email} not found`,
        'CartService',
        'reduceByOne',
      );

      throw new NotFoundException(`Cart with email: ${doc.email} not found`);
    }

    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === doc.product.toString()) a.push(i);
      return a;
    }, []);

    if (indexesFound.length === 0) {
      this.debuggerService.error(
        `No product in cart with id ${doc.product.toString()}`,
        'CartService',
        'reduceByOne',
      );

      throw new NotFoundException(
        `No product in cart with id ${doc.product.toString()}`,
      );
    }

    for (const indexFound of indexesFound) {
      if (
        cart.items[indexFound].quantity === 1 &&
        cart.items[indexFound].selectedColor.toString() ===
          doc.color.toString() &&
        cart.items[indexFound].selectedSize.toString() === doc.size.toString()
      ) {
        cart.items.splice(indexFound, 1);
        cart.totalQuantity -= 1;
        cart.totalPrice -= price - priceDiscount;
      } else if (
        cart.items[indexFound].selectedColor.toString() ===
          doc.color.toString() &&
        cart.items[indexFound].selectedSize.toString() === doc.size.toString()
      ) {
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

  async increaseByOne(doc: CreateCartDto) {
    let cart = await this.repository.findOne({
      email: doc.email,
    });
    const product = await this.productService.findById(doc.product);
    const { price, priceDiscount } = product;

    if (!cart) {
      this.debuggerService.error(
        `Cart with email: ${doc.email} not found`,
        'CartService',
        'increaseByOne',
      );

      throw new NotFoundException(`Cart with email: ${doc.email} not found`);
    }

    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === doc.product.toString()) a.push(i);
      return a;
    }, []);

    if (indexesFound.length === 0) {
      this.debuggerService.error(
        `No product in cart with id ${doc.product.toString()}`,
        'CartService',
        'increaseByOne',
      );

      throw new NotFoundException(
        `No product in cart with id ${doc.product.toString()}`,
      );
    }

    for (const indexFound of indexesFound) {
      if (
        cart.items[indexFound].selectedColor.toString() ===
          doc.color.toString() &&
        cart.items[indexFound].selectedSize.toString() === doc.size.toString()
      ) {
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
    }

    await cart.save();

    return await this.repository.findById(cart._id);
  }

  async deleteItemFromCart(doc: CreateCartDto) {
    const cart = await this.repository.findOne({ email: doc.email });

    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === doc.product.toString()) a.push(i);
      return a;
    }, []);

    for (const indexFound of indexesFound) {
      if (
        cart.items[indexFound].selectedColor.toString() ===
          doc.color.toString() &&
        cart.items[indexFound].selectedSize.toString() === doc.size.toString()
      ) {
        const totalPrice = cart.totalPrice - cart.items[indexFound].total;
        const totalQuantity =
          cart.totalQuantity - cart.items[indexFound].quantity;

        await this.repository.updateOne(
          { email: doc.email },
          {
            $pull: {
              items: {
                product: doc.product,
                selectedColor: doc.color,
                selectedSize: doc.size,
              },
            },
            totalPrice,
            totalQuantity,
          },
        );
      }
    }

    return await this.repository.findById(cart._id);
  }
}
