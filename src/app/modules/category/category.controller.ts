import {
    Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse,
    ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { SingleFileUploadDto } from '@shared/dtos/file-upload.dto';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtAuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FindCategoriesDto } from './dtos/find-categories.dto';
import { PaginatedCategoryDto } from './dtos/paginated-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.service.create(data);
  }

  @Get()
  @Roles(RoleTypeEnum.All)
  findAll(@Query(new PaginationPipe()) q: FindCategoriesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @Roles(RoleTypeEnum.All)
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  updateById(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/upload')
  @ApiConsumes('multipart/form-data')
  upload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(id, file);
  }
}
