import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { CartDto } from './dtos/cart.dto';
import { PaginatedCartDto } from './dtos/paginated-cart.dto';
import { FindCartsDto } from './dtos/find-carts.dto';
import { UpdateCartDto } from './dtos/update-cart.dto';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/create-cart.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Put(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: CartDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  updateById(@Param('id') id: string, @Body() data: UpdateCartDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found successfully',
    type: PaginatedCartDto,
  })
  findAll(@Query(new PaginationPipe()) q: FindCartsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found successfully',
    type: CartDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @Post()
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: CartDto,
  })
  addItemToCart(@Body() data: CreateCartDto) {
    return this.service.addProductToCart(data);
  }

  @Put('/reduce-one')
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: CartDto,
  })
  reduceByOne(@Body() data: CreateCartDto) {
    return this.service.reduceByOne(data);
  }

  @Put('/incease-one')
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: CartDto,
  })
  increaseByOne(@Body() data: CreateCartDto) {
    return this.service.increaseByOne(data);
  }

  @Delete(':productId')
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: CartDto,
  })
  deleteItemFromCart(@Body() data: CreateCartDto) {
    return this.service.deleteItemFromCart(data);
  }
}
