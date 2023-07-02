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
import { ApiTags } from '@nestjs/swagger';
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
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  create(@Body() data: CreateColorDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  findAll(@Query(new PaginationPipe()) q: FindColorsDto) {
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
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  updateById(@Param('id') id: string, @Body() data: UpdateColorDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
