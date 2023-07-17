import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiQuery, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateSizeDto } from './dtos/create-size.dto';
import { FindSizesDto } from './dtos/find-sizes.dto';
import { UpdateSizeDto } from './dtos/update-size.dto';
import { SizeService } from './size.service';

@ApiTags('Sizes')
@Controller('sizes')
@Roles(RoleTypeEnum.All)
export class SizeController {
  constructor(private readonly service: SizeService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new size' })
  @ApiCreatedResponse({ description: 'The size has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBody({ type: CreateSizeDto })
  create(@Body() data: CreateSizeDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiOkResponse({ description: 'Successfully returned all sizes.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiQuery({ type: FindSizesDto })
  findAll(@Query(new PaginationPipe()) q: FindSizesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get size by ID' })
  @ApiOkResponse({ description: 'Successfully returned the size.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiNotFoundResponse({ description: 'Size not found.' })
  @ApiParam({ name: 'id', description: 'Size ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update size by ID' })
  @ApiOkResponse({ description: 'Successfully updated the size.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiNotFoundResponse({ description: 'Size not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiParam({ name: 'id', description: 'Size ID' })
  @ApiBody({ type: UpdateSizeDto })
  updateById(@Param('id') id: string, @Body() data: UpdateSizeDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete size by ID' })
  @ApiOkResponse({ description: 'Successfully deleted the size.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiNotFoundResponse({ description: 'Size not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiParam({ name: 'id', description: 'Size ID' })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}