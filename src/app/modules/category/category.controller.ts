import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FindCategoriesDto } from './dtos/find-categories.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin, RoleTypeEnum.Vendor)
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
  @AllowAnonymous()
  findAll(@Query(new PaginationPipe()) q: FindCategoriesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @Roles(RoleTypeEnum.All)
  @AllowAnonymous()
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
