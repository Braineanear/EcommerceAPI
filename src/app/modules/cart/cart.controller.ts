import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';

import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { ProductCartDto } from './dtos/product-cart.dto';

@ApiTags('Carts')
@Controller('carts')
@Roles(RoleTypeEnum.All)
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  findCart(@AuthUser() user: JwtPayload) {
    return this.service.queryCart(user.sub._id);
  }

  @Post()
  addItemToCart(@Body() data: CreateCartDto, @AuthUser() user: JwtPayload) {
    return this.service.addProductToCart(data, user.sub._id);
  }

  @Put('/reduce-one')
  reduceByOne(@Body() data: ProductCartDto, @AuthUser() user: JwtPayload) {
    return this.service.reduceByOne(data, user.sub._id);
  }

  @Put('/increase-one')
  increaseByOne(@Body() data: ProductCartDto, @AuthUser() user: JwtPayload) {
    return this.service.increaseByOne(data, user.sub._id);
  }

  @Delete('/delete-product')
  deleteItemFromCart(
    @Body() data: ProductCartDto,
    @AuthUser() user: JwtPayload,
  ) {
    return this.service.deleteItemFromCart(data, user.sub._id);
  }

  @Delete()
  deleteCart(@AuthUser() user: JwtPayload) {
    return this.service.deleteCart(user.sub._id);
  }
}
