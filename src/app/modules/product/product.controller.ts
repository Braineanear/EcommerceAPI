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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { ProductService } from './product.service';
import { ProductDto } from './dtos/product.dto';
import { PaginatedProductDto } from './dtos/paginated-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { FindProductsDto } from './dtos/find-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { UploadFileMultiple } from '@shared/decorators/file.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { SingleFileUploadDto } from '@shared/dtos/file-upload.dto';
import { MultipleFilesUploadDto } from '@shared/dtos/file-upload.dto';

@ApiBearerAuth()
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: ProductDto,
  })
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  updateById(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found successfully',
    type: PaginatedProductDto,
  })
  findAll(@Query(new PaginationPipe()) q: FindProductsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found successfully',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiOkResponse({
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/main')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: SingleFileUploadDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  uploadMainImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadMainImage(id, file);
  }

  @UploadFileMultiple('files', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/multiple')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: MultipleFilesUploadDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  upload(
    @Param('id') id: string,
    @UploadedFile() files: Express.Multer.File[],
  ) {
    return this.service.uploadImages(id, files);
  }
}
