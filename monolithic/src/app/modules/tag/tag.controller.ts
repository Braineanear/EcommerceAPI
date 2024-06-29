import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateTagDto } from './dtos/create-tag.dto';
import { FindTagsDto } from './dtos/find-tags.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { TagService } from './tag.service';

@ApiTags('Tags')
@Controller('tags')
@Roles(RoleTypeEnum.All)
@ApiForbiddenResponse({
  description: 'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
export class TagController {
  constructor(private readonly service: TagService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create tag' })
  @ApiBody({ type: CreateTagDto, description: 'Tag Information' })
  @ApiCreatedResponse({ description: 'Successfully created tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() data: CreateTagDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({ type: FindTagsDto, description: 'Pagination options' })
  @ApiOkResponse({ description: 'Successfully fetched tags.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  findAll(@Query(new PaginationPipe()) q: FindTagsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Tag ID' })
  @ApiOkResponse({ description: 'Successfully fetched tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tag by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Tag ID' })
  @ApiBody({ type: UpdateTagDto, description: 'Tag Information' })
  @ApiOkResponse({ description: 'Successfully updated tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  updateById(@Param('id') id: string, @Body() data: UpdateTagDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tag by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Tag ID' })
  @ApiOkResponse({ description: 'Successfully deleted tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
