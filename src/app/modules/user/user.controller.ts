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
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateUserDto } from './dtos/create-user.dto';
import { FindUsersDto } from './dtos/find-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create User' })
  @ApiBody({ type: CreateUserDto, description: 'User Data' })
  @ApiCreatedResponse({ description: 'User has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async create(@Body() data: CreateUserDto) {
    return this.service.create(data);
  }

  @Get('me')
  @Roles(RoleTypeEnum.All)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Logged in User Details' })
  @ApiOkResponse({
    description: 'Successfully fetched logged in user details.',
  })
  async getLoggedinUserDetails(@AuthUser() user: any) {
    return this.service.getLoggedinUserDetails(user._id);
  }

  @Delete('me')
  @ApiBearerAuth()
  @Roles(RoleTypeEnum.All)
  @ApiOperation({ summary: 'Delete Logged in User Details' })
  @ApiOkResponse({
    description: 'Successfully deleted logged in user details.',
  })
  async deleteLoggedinUserDetails(@AuthUser() user: any) {
    return this.service.deleteLoggedinUserDetails(user._id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post('me/images/upload')
  @Roles(RoleTypeEnum.All)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload Logged in User Image' })
  @ApiCreatedResponse({ description: 'Image has been successfully uploaded.' })
  async uploadLoggedinUserImage(
    @AuthUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadLoggedinUserImage(user._id, file);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User by ID' })
  @ApiBody({ type: UpdateUserDto, description: 'New User Data' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiOkResponse({ description: 'User has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async updateById(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Users' })
  @ApiQuery({ type: FindUsersDto, description: 'Pagination options' })
  @ApiOkResponse({ description: 'Successfully fetched users.' })
  async findAll(@Query(new PaginationPipe()) q: FindUsersDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiOkResponse({ description: 'Successfully fetched user.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiOkResponse({ description: 'User has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload User Image' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiCreatedResponse({ description: 'Image has been successfully uploaded.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadImage(id, file);
  }
}
