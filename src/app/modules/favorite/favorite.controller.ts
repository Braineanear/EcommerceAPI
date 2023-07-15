import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FindFavoritesDto } from './dtos/find-favorites.dto';
import { UpdateFavoriteDto } from './dtos/update-favorite.dto';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorites')
@Controller('favorites')
@Roles(RoleTypeEnum.All)
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Get()
  findAll(
    @Query(new PaginationPipe()) q: FindFavoritesDto,
    @AuthUser() user: JwtPayload,
  ) {
    return this.service.findFavorites(
      (<any>q).filter,
      {
        ...(<any>q).options,
      },
      user.sub,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @Post()
  create(@Body() data: CreateFavoriteDto, @AuthUser() user: JwtPayload) {
    return this.service.create(data, user.sub);
  }
}
