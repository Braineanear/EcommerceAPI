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

import { CreateSizeDto } from './dtos/create-size.dto';
import { FindSizesDto } from './dtos/find-sizes.dto';
import { UpdateSizeDto } from './dtos/update-size.dto';
import { SizeService } from './size.service';

@ApiTags('Sizes')
@Controller('sizes')
@Roles(RoleTypeEnum.All)
export class SizeController {
  constructor(private readonly service: SizeService) {}

  @Post()
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  create(@Body() data: CreateSizeDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  findAll(@Query(new PaginationPipe()) q: FindSizesDto) {
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
  updateById(@Param('id') id: string, @Body() data: UpdateSizeDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
