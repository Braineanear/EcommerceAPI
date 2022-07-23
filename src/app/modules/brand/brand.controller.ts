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
import { BrandDto } from './dtos/brand.dto';
import { PaginatedBrandDto } from './dtos/paginated-brand.dto';
import { FindBrandsDto } from './dtos/find-brands.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dtos/create-brand.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiTags('Brands')
@Controller('Brands')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Put(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: BrandDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  updateById(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found successfully',
    type: PaginatedBrandDto,
  })
  findAll(@Query(new PaginationPipe()) q: FindBrandsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found successfully',
    type: BrandDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
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
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: BrandDto,
  })
  create(@Body() data: CreateBrandDto) {
    return this.service.create(data);
  }
}
