import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
} from '@nestjs/swagger';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { ColorService } from './color.service';
import { CreateColorDto } from './dtos/create-color.dto';
import { FindColorsDto } from './dtos/find-colors.dto';
import { UpdateColorDto } from './dtos/update-color.dto';

@ApiTags('Colors')
@Controller('colors')
@Roles(RoleTypeEnum.All)
export class ColorController {
  constructor(private readonly service: ColorService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The color has been successfully created.',
  })
  @ApiOperation({ summary: 'Create color' })
  @ApiBody({ type: CreateColorDto, description: 'Color Information' })
  create(@Body() data: CreateColorDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Successfully fetched colors.' })
  @ApiOperation({ summary: 'Get all colors' })
  @ApiQuery({ type: FindColorsDto, description: 'Pagination options' })
  findAll(@Query(new PaginationPipe()) q: FindColorsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Successfully fetched color.' })
  @ApiOperation({ summary: 'Get color by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Color ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({ description: 'Successfully updated color.' })
  @ApiOperation({ summary: 'Update color by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Color ID' })
  @ApiBody({ type: UpdateColorDto, description: 'Updated Color Information' })
  updateById(@Param('id') id: string, @Body() data: UpdateColorDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({ description: 'Successfully deleted color.' })
  @ApiOperation({ summary: 'Delete color by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Color ID' })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
