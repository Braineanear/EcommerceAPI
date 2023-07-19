import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { ProductCartDto } from './dtos/product-cart.dto';

@ApiTags('Carts')
@Controller('carts')
@Roles(RoleTypeEnum.All)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Find a cart' })
  @ApiOkResponse({ description: 'Successfully found the cart' })
  @ApiNotFoundResponse({ description: "Can't find the cart" })
  findCart(@AuthUser() user: JwtPayload) {
    return this.service.queryCart(user.sub._id);
  }

  @Post()
  @ApiOperation({ summary: 'Add an item to cart' })
  @ApiCreatedResponse({ description: 'Item successfully added to cart' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: CreateCartDto })
  addItemToCart(@Body() data: CreateCartDto, @AuthUser() user: JwtPayload) {
    return this.service.addProductToCart(data, user.sub._id);
  }

  @Put('/reduce-one')
  @ApiOperation({ summary: 'Reduce quantity of an item in cart by one' })
  @ApiOkResponse({ description: 'Quantity reduced successfully' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: ProductCartDto })
  reduceByOne(@Body() data: ProductCartDto, @AuthUser() user: JwtPayload) {
    return this.service.reduceByOne(data, user.sub._id);
  }

  @Put('/increase-one')
  @ApiOperation({ summary: 'Increase quantity of an item in cart by one' })
  @ApiOkResponse({ description: 'Quantity increased successfully' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: ProductCartDto })
  increaseByOne(@Body() data: ProductCartDto, @AuthUser() user: JwtPayload) {
    return this.service.increaseByOne(data, user.sub._id);
  }

  @Delete('/delete-product')
  @ApiOperation({ summary: 'Delete an item from cart' })
  @ApiOkResponse({ description: 'Item deleted from cart successfully' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: ProductCartDto })
  deleteItemFromCart(
    @Body() data: ProductCartDto,
    @AuthUser() user: JwtPayload,
  ) {
    return this.service.deleteItemFromCart(data, user.sub._id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a cart' })
  @ApiOkResponse({ description: 'Cart deleted successfully' })
  deleteCart(@AuthUser() user: JwtPayload) {
    return this.service.deleteCart(user.sub._id);
  }

  @Get('/:productId/count')
  @ApiOperation({ summary: 'Count the quantity of a specific product in cart' })
  @ApiOkResponse({ description: 'Counted product quantity successfully' })
  @ApiNotFoundResponse({ description: "Can't find the product in the cart" })
  @ApiParam({ name: 'productId', type: String })
  countProductInCart(
    @AuthUser() user: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.service.cartProductCount(productId, user.sub._id);
  }
}
