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
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateBrandDto } from './dtos/create-brand.dto';
import { FindBrandsDto } from './dtos/find-brands.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';

import { BrandService } from './brand.service';

@ApiTags('Brands')
@Controller('brands')
@Roles(RoleTypeEnum.All)
@ApiBearerAuth()
export class BrandController {
  constructor(private readonly service: BrandService) {}

  // Route: POST: /brands
  @Post()
  // Roles: SuperAdmin, Admin
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  // Swagger
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiCreatedResponse({
    description: 'The brand has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBody({ type: CreateBrandDto })
  // Controller
  create(@Body() data: CreateBrandDto) {
    return this.service.create(data);
  }

  // Route: GET: /brands
  @Get()
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Get all brands' })
  @ApiOkResponse({
    description: 'A list of brands has been retrieved successfully.',
  })
  @ApiQuery({ name: 'q', type: FindBrandsDto, required: false })
  // Controller
  findAll(@Query(new PaginationPipe()) q: FindBrandsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  // Route: GET: /brands/:id
  @Get(':id')
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiOkResponse({ description: 'The brand has been retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Brand ID' })
  // Controller
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // Route: PUT: /brands/:id
  @Put(':id')
  // Roles: SuperAdmin, Admin
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  // Swagger
  @ApiOperation({ summary: 'Update a brand by ID' })
  @ApiOkResponse({ description: 'The brand has been updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiNotFoundResponse({ description: 'Brand not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiParam({ name: 'id', type: String, description: 'Brand ID' })
  @ApiBody({ type: UpdateBrandDto })
  // Controller
  updateById(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.service.updateById(id, data);
  }

  // Route: DELETE: /brands/:id
  @Delete(':id')
  // Roles: SuperAdmin, Admin
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  // Swagger
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiOkResponse({ description: 'The brand has been deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Brand not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiParam({ name: 'id', type: String, description: 'Brand ID' })
  // Controller
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
