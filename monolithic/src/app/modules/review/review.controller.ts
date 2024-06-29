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
  ApiBearerAuth,
  ApiBody,
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
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
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
  @ApiOkResponse({ description: 'Successfully updated review.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiOperation({ summary: 'Update review by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Review ID' })
  @ApiBody({ type: UpdateReviewDto, description: 'Review Information' })
  updateReview(
    @Param('id') id: string,
    @Body() data: UpdateReviewDto,
    @AuthUser() user: any,
  ) {
    return this.service.updateReview(id, data, user._id);
  }

  @Get()
  @ApiOkResponse({ description: 'Successfully fetched reviews.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiQuery({ type: FindReviewsDto, description: 'Pagination options' })
  findAll(@Query(new PaginationPipe()) q: FindReviewsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successfully fetched review.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Review ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully deleted review.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiOperation({ summary: 'Delete review by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Review ID' })
  deleteReview(@Param('id') id: string, @AuthUser() user: any) {
    return this.service.deleteReview(id, user._id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Successfully created review.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Create review' })
  @ApiBody({ type: CreateReviewDto, description: 'Review Information' })
  create(@Body() data: CreateReviewDto, @AuthUser() user: any) {
    return this.service.create(data, user._id);
  }
}
