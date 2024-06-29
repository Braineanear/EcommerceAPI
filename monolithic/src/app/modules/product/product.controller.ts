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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UploadFileMultiple,
  UploadFileSingle,
} from '@shared/decorators/file.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
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
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiCreatedResponse({ description: 'Product successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiForbiddenResponse({ description: 'Access forbidden.' })
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto, description: 'Product details' })
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({ description: 'Product successfully updated.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiForbiddenResponse({ description: 'Access forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto, description: 'Updated product details' })
  updateById(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Products retrieved successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ type: FindProductsDto, description: 'Pagination options' })
  findAll(@Query(new PaginationPipe()) q: FindProductsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Product retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  findById(@Param('id') id: string, @AuthUser() user: any) {
    return this.service.findById(id, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({ description: 'Product successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiForbiddenResponse({ description: 'Access forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  // Controller
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @Post(':id/images/main')
  @ApiBearerAuth()
  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Main image successfully uploaded.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiForbiddenResponse({ description: 'Access forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Upload main product image' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  uploadMainImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadMainImage(id, file);
  }

  @Delete(':id/images/main')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({ description: 'Main image successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiForbiddenResponse({ description: 'Access forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Delete main product image' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  deleteMainImage(@Param('id') id: string) {
    return this.service.deleteMainImage(id);
  }

  @Post(':id/images/multiple')
  @ApiBearerAuth()
  @UploadFileMultiple('files', ENUM_FILE_TYPE.IMAGE)
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Multiple images successfully uploaded.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiForbiddenResponse({ description: 'Access forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Upload multiple product images' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  upload(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.uploadImages(id, files);
  }

  @Delete(':id/images/multiple/:imageId')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({ description: 'Sub image successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiForbiddenResponse({ description: 'Access forbidden.' })
  @ApiNotFoundResponse({ description: 'Product or image not found.' })
  @ApiOperation({ summary: 'Delete sub product image' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiParam({ name: 'imageId', type: 'string', description: 'Image ID' })
  deleteSubImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.service.deleteSubImage(id, imageId);
  }
}
