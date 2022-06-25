import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { ImageDto } from './dtos/image.dto';
import { PaginatedImageDto } from './dtos/paginated-image.dto';
import { FindImagesDto } from './dtos/find-images.dto';
import { UpdateImageDto } from './dtos/update-image.dto';
import { ImageService } from './image.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @Put(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: ImageDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  updateById(@Param('id') id: string, @Body() data: UpdateImageDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found successfully',
    type: PaginatedImageDto,
  })
  findAll(@Query(new PaginationPipe()) q: FindImagesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found successfully',
    type: ImageDto,
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
}
