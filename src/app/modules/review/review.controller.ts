import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateReviewDto } from './dtos/create-review.dto';
import { FindReviewsDto } from './dtos/find-reviews.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ReviewService } from './review.service';

@ApiTags('Reviews')
@Controller('reviews')
@Roles(RoleTypeEnum.All)
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Put(':id')
  @ApiBearerAuth()
  updateReview(
    @Param('id') id: string,
    @Body() data: UpdateReviewDto,
    @AuthUser() user: JwtPayload,
  ) {
    return this.service.updateReview(id, data, user.sub);
  }

  @Get()
  findAll(@Query(new PaginationPipe()) q: FindReviewsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  deleteReview(@Param('id') id: string, @AuthUser() user: JwtPayload) {
    return this.service.deleteReview(id, user.sub);
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() data: CreateReviewDto, @AuthUser() user: JwtPayload) {
    return this.service.create(data, user.sub);
  }
}
