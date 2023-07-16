import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
    ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
    ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

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
@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: OrderDto,
  })
  create(@Body() data: any, @AuthUser() user: IUserDocument) {
    return this.service.create(data, user._id);
  }

  @Put(':id')
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: OrderDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  updateById(@Param('id') id: string, @Body() data: any) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiOkResponse({
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }
}
