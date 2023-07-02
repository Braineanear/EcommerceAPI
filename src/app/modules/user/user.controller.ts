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
  ApiConsumes,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateUserDto } from './dtos/create-user.dto';
import { FindUsersDto } from './dtos/find-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.service.create(data);
  }

  @Get('me')
  @Roles(RoleTypeEnum.All)
  async getLoggedinUserDetails(@AuthUser() user: JwtPayload) {
    return this.service.getLoggedinUserDetails(user);
  }

  @Delete('me')
  @Roles(RoleTypeEnum.All)
  async deleteLoggedinUserDetails(@AuthUser() user: JwtPayload) {
    return this.service.deleteLoggedinUserDetails(user);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post('me/images/upload')
  @Roles(RoleTypeEnum.All)
  @ApiConsumes('multipart/form-data')
  async uploadLoggedinUserImage(
    @AuthUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadLoggedinUserImage(user, file);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  async findAll(@Query(new PaginationPipe()) q: FindUsersDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/upload')
  @ApiConsumes('multipart/form-data')
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadImage(id, file);
  }
}
