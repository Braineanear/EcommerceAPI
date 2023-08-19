import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { FindHistoriesDto } from './dtos/find-history.dto';
import { HistoryService } from './history.service';

@ApiTags('Histories')
@Controller('histories')
@ApiBearerAuth()
@Roles(RoleTypeEnum.All)
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @Get()
  findAll(@Query(new PaginationPipe()) q: FindHistoriesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  deleteHistory(@Param('id') id: string, @AuthUser() user: any) {
    return this.service.deleteHistory(id, user);
  }
}
