import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FindFavoritesDto } from './dtos/find-favorites.dto';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorites')
@Controller('favorites')
@ApiBearerAuth()
@Roles(RoleTypeEnum.All)
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Get()
  @ApiOkResponse({ description: 'Successfully fetched favorites.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiQuery({ type: FindFavoritesDto, description: 'Pagination options' })
  findAll(
    @Query(new PaginationPipe()) q: FindFavoritesDto,
    @AuthUser() user: any,
  ) {
    return this.service.findFavorites(
      (<any>q).filter,
      {
        ...(<any>q).options,
      },
      user,
    );
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successfully fetched favorite.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Favorite not found.' })
  @ApiOperation({ summary: 'Get favorite by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Favorite ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Successfully deleted favorite.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Favorite not found.' })
  @ApiOperation({ summary: 'Delete favorite by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Favorite ID' })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Successfully created favorite.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Create favorite' })
  @ApiBody({ type: CreateFavoriteDto, description: 'Favorite Information' })
  create(@Body() data: CreateFavoriteDto, @AuthUser() user: any) {
    return this.service.create(data, user);
  }
}
