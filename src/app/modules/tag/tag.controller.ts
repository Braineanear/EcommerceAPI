import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateTagDto } from './dtos/create-tag.dto';
import { FindTagsDto } from './dtos/find-tags.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { TagService } from './tag.service';

@ApiTags('Tags')
@Controller('tags')
@Roles(RoleTypeEnum.All)
export class TagController {
  constructor(private readonly service: TagService) {}

  @Post()
  @ApiBearerAuth()
  create(@Body() data: CreateTagDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  findAll(@Query(new PaginationPipe()) q: FindTagsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  updateById(@Param('id') id: string, @Body() data: UpdateTagDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
