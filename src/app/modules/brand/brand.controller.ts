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

import { BrandService } from './brand.service';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { FindBrandsDto } from './dtos/find-brands.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';

@ApiTags('Brands')
@Controller('brands')
@Roles(RoleTypeEnum.All)
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiCreatedResponse({
    description: 'The brand has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBody({ type: CreateBrandDto })
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  create(@Body() data: CreateBrandDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  findAll(@Query(new PaginationPipe()) q: FindBrandsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  updateById(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
