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
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto, description: 'Product Information' })
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The product has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Updated Product Information',
  })
  updateById(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Successfully fetched products.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ type: FindProductsDto, description: 'Pagination options' })
  findAll(@Query(new PaginationPipe()) q: FindProductsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Successfully fetched product.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({ description: 'Successfully deleted product.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/main')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully uploaded main image.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
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
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully deleted main image.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Delete main product image' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  deleteMainImage(@Param('id') id: string) {
    return this.service.deleteMainImage(id);
  }

  @UploadFileMultiple('files', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/multiple')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully uploaded multiple images.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Upload multiple product images' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  upload(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.service.uploadImages(id, files);
  }

  @Delete(':id/images/multiple/:imageId')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully deleted sub image.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Product or image not found.' })
  @ApiOperation({ summary: 'Delete sub product image' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiParam({ name: 'imageId', type: 'string', description: 'Image ID' })
  deleteSubImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.service.deleteSubImage(id, imageId);
  }
}
