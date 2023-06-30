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
import { FavoriteDto } from './dtos/favorite.dto';
import { PaginatedFavoriteDto } from './dtos/paginated-favorite.dto';
import { FindFavoritesDto } from './dtos/find-favorites.dto';
import { UpdateFavoriteDto } from './dtos/update-favorite.dto';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { AuthUser } from '@shared/decorators/auth-user.decorator';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Put(':id')
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: FavoriteDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  updateById(@Param('id') id: string, @Body() data: UpdateFavoriteDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found successfully',
    type: PaginatedFavoriteDto,
  })
  findAll(@Query(new PaginationPipe()) q: FindFavoritesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found successfully',
    type: FavoriteDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
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
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: FavoriteDto,
  })
  create(@Body() data: CreateFavoriteDto, @AuthUser() user: IUserDocument) {
    return this.service.create(data, user);
  }

  @Delete('/product/:id')
  @ApiOkResponse({
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  deleteByProductId(@Param('id') id: string, @AuthUser() user: IUserDocument) {
    return this.service.deleteFavoriteProduct(id, user);
  }
}
