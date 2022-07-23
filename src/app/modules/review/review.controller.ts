import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { NotFoundDto } from '@shared/dtos/not-found.dto';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { ReviewDto } from './dtos/review.dto';
import { PaginatedReviewDto } from './dtos/paginated-review.dto';
import { FindReviewsDto } from './dtos/find-reviews.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { ReviewService } from './review.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'You are not authorized to access this endpoint, please login!',
})
@ApiForbiddenResponse({
  description:
    'You are not authorized to access this endpoint, please contact the administrator!',
})
@ApiTags('Reviews')
@Controller('Reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Put(':id')
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOkResponse({
    description: 'Record updated successfully',
    type: ReviewDto,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    type: NotFoundDto,
  })
  updateById(@Param('id') id: string, @Body() data: UpdateReviewDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found successfully',
    type: PaginatedReviewDto,
  })
  findAll(@Query(new PaginationPipe()) q: FindReviewsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found successfully',
    type: ReviewDto,
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

  @Post()
  @Roles(RoleTypeEnum.SuperAdmin)
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: ReviewDto,
  })
  create(@Body() data: CreateReviewDto, @AuthUser() user: IUserDocument) {
    return this.service.create(data, user._id);
  }
}
