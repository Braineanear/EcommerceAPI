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
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  UploadFileMultiple,
  UploadFileSingle,
} from '@shared/decorators/file.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateProductDto } from './dtos/create-product.dto';
import { FindProductsDto } from './dtos/find-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
@Roles(RoleTypeEnum.All)
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @Put(':id')
  updateById(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @AllowAnonymous()
  findAll(@Query(new PaginationPipe()) q: FindProductsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('main/image/:id')
  findMainProductImage(@Param('id') id: string) {
    return this.service.getMainProductImage(id);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/main')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  uploadMainImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadMainImage(id, file);
  }

  @Delete(':id/images/main')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  deleteMainImage(@Param('id') id: string) {
    return this.service.deleteMainImage(id);
  }

  @UploadFileMultiple('files', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/multiple')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  upload(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.service.uploadImages(id, files);
  }

  @Delete(':id/images/multiple/:imageId')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  deleteSubImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.service.deleteSubImage(id, imageId);
  }
}
