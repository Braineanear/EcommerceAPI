import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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

import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

import { CreateCartDto } from './dtos/create-cart.dto';
import { ProductCartDto } from './dtos/product-cart.dto';

import { CartService } from './cart.service';

@ApiTags('Carts')
@Controller('carts')
@Roles(RoleTypeEnum.All)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly service: CartService) {}

  // Route: GET: /carts
  @Get()
  // Swagger
  @ApiOperation({ summary: 'Find a cart' })
  @ApiOkResponse({ description: 'Successfully found the cart' })
  @ApiNotFoundResponse({ description: "Can't find the cart" })
  // Controller
  findCart(@AuthUser() user: any) {
    return this.service.queryCart(user._id);
  }

  // Route: POST: /carts
  @Post()
  // Swagger
  @ApiOperation({ summary: 'Add an item to cart' })
  @ApiCreatedResponse({ description: 'Item successfully added to cart' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: CreateCartDto })
  // Controller
  addItemToCart(@Body() data: CreateCartDto, @AuthUser() user: any) {
    return this.service.addProductToCart(data, user._id);
  }

  // Route: PUT: /carts/reduce-one
  @Put('/reduce-one')
  // Swagger
  @ApiOperation({ summary: 'Reduce quantity of an item in cart by one' })
  @ApiOkResponse({ description: 'Quantity reduced successfully' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: ProductCartDto })
  // Controller
  reduceByOne(@Body() data: ProductCartDto, @AuthUser() user: any) {
    return this.service.reduceByOne(data, user._id);
  }

  // Route: PUT: /carts/increase-one
  @Put('/increase-one')
  // Swagger
  @ApiOperation({ summary: 'Increase quantity of an item in cart by one' })
  @ApiOkResponse({ description: 'Quantity increased successfully' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: ProductCartDto })
  // Controller
  increaseByOne(@Body() data: ProductCartDto, @AuthUser() user: any) {
    return this.service.increaseByOne(data, user._id);
  }

  // Route: DELETE: /carts/delete-product
  @Delete('/delete-product')
  // Swagger
  @ApiOperation({ summary: 'Delete an item from cart' })
  @ApiOkResponse({ description: 'Item deleted from cart successfully' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiBody({ type: ProductCartDto })
  // Controller
  deleteItemFromCart(@Body() data: ProductCartDto, @AuthUser() user: any) {
    return this.service.deleteItemFromCart(data, user._id);
  }

  // Route: DELETE: /carts
  @Delete()
  // Swagger
  @ApiOperation({ summary: 'Delete a cart' })
  @ApiOkResponse({ description: 'Cart deleted successfully' })
  @ApiNotFoundResponse({ description: "Can't find the cart" })
  // Controller
  deleteCart(@AuthUser() user: any) {
    return this.service.deleteCart(user._id);
  }

  // Route: GET: /carts/:productId/count
  @Get('/:productId/count')
  // Swagger
  @ApiOperation({ summary: 'Count the quantity of a specific product in cart' })
  @ApiOkResponse({ description: 'Counted product quantity successfully' })
  @ApiNotFoundResponse({ description: "Can't find the product in the cart" })
  @ApiParam({ name: 'productId', type: String })
  // Controller
  countProductInCart(
    @AuthUser() user: any,
    @Param('productId') productId: string,
  ) {
    return this.service.cartProductCount(productId, user._id);
  }
}
