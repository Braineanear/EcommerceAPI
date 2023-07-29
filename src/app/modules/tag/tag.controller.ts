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
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateTagDto } from './dtos/create-tag.dto';
import { FindTagsDto } from './dtos/find-tags.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { TagService } from './tag.service';

@ApiTags('Tags')
@Controller('tags')
@Roles(RoleTypeEnum.All)
export class TagController {
  constructor(private readonly service: TagService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Successfully created tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Create tag' })
  @ApiBody({ type: CreateTagDto, description: 'Tag Information' })
  create(@Body() data: CreateTagDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOkResponse({ description: 'Successfully fetched tags.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({ type: FindTagsDto, description: 'Pagination options' })
  findAll(@Query(new PaginationPipe()) q: FindTagsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successfully fetched tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Tag ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully updated tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  @ApiOperation({ summary: 'Update tag by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Tag ID' })
  @ApiBody({ type: UpdateTagDto, description: 'Tag Information' })
  updateById(@Param('id') id: string, @Body() data: UpdateTagDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully deleted tag.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  @ApiOperation({ summary: 'Delete tag by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Tag ID' })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
