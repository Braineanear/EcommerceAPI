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
  ApiConsumes,
} from '@nestjs/swagger';

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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
  })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() data: CreateCategoryDto) {
    return this.service.create(data);
  }

  @Get()
  @Roles(RoleTypeEnum.All)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Find all categories' })
  @ApiOkResponse({ description: 'Successfully found categories' })
  findAll(@Query(new PaginationPipe()) q: FindCategoriesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @Roles(RoleTypeEnum.All)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Find category by ID' })
  @ApiOkResponse({ description: 'Successfully found the category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiOkResponse({ description: 'Successfully updated the category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCategoryDto })
  updateById(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiOkResponse({ description: 'Successfully deleted the category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({ name: 'id', type: String })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload image for category' })
  @ApiCreatedResponse({ description: 'Successfully uploaded the image' })
  @ApiBadRequestResponse({ description: 'Invalid file upload request' })
  @ApiParam({ name: 'id', type: String })
  upload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(id, file);
  }
}
