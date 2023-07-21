import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
    ApiBearerAuth, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';

import { OrderDto } from './dtos/order.dto';
import { OrderService } from './order.service';

@ApiBearerAuth()
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
@Roles(RoleTypeEnum.All)
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  create(@Body() data: any, @AuthUser() user: JwtPayload) {
    return this.service.create(data, user.sub);
  }

  @Put('/:id/status')
  changeOrderStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.service.changeOrderStatus(id, data.status);
  }

  @Get()
  getOrders(@AuthUser() user: JwtPayload) {
    return this.service.getOrders(user.sub);
  }

  @Get(':id')
  getOrder(@Param('id') id: string, @AuthUser() user: JwtPayload) {
    return this.service.getOrder(user.sub, id);
  }

  @Delete(':id/cancel')
  cancelOrder(@Param('id') id: string, @AuthUser() user: JwtPayload) {
    return this.service.cancelOrder(user.sub, id);
  }
}
