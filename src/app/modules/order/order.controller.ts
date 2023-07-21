import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
    ApiBearerAuth, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';

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
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  create(@Body() data: any, @AuthUser() user: IUserDocument) {
    return this.service.create(data, user._id);
  }

  @Put('/:id/status')
  changeOrderStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.service.changeOrderStatus(id, data.status);
  }

  @Get()
  getOrders(@AuthUser() user: IUserDocument) {
    return this.service.getOrders(user);
  }

  @Get(':id')
  getOrder(@Param('id') id: string, @AuthUser() user: IUserDocument) {
    return this.service.getOrder(user, id);
  }

  @Get(':id/cancel')
  cancelOrder(@Param('id') id: string, @AuthUser() user: IUserDocument) {
    return this.service.cancelOrder(user, id);
  }
}
