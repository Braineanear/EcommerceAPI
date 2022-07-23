import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { CategoryDto } from './dtos/category.dto';
import { PaginatedCategoryDto } from './dtos/paginated-category.dto';
import { FindCategoriesDto } from './dtos/find-categories.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryService } from './category.service';
import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { SingleFileUploadDto } from '@shared/dtos/file-upload.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { JwtAuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Put(':id')
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  updateById(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found successfully',
    type: PaginatedCategoryDto,
  })
  findAll(@Query(new PaginationPipe()) q: FindCategoriesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found successfully',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: SingleFileUploadDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  upload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(id, file);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: CategoryDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  create(@Body() data: CreateCategoryDto) {
    return this.service.create(data);
  }
}
