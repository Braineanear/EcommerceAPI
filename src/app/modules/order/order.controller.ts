import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { OrderService } from './order.service';
import { OrderDto } from './dtos/order.dto';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { IUserDocument } from '@modules/user/interfaces/user.interface';

@ApiBearerAuth()
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
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
