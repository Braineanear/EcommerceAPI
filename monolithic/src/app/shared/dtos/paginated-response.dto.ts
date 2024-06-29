import { ApiProperty } from '@nestjs/swagger';
import { IPaginatedInterface } from '../interfaces/i-paginate-result.interface';

export class PaginatedResponseDto<Model> implements IPaginatedInterface<Model> {
  @ApiProperty({ description: 'List of documents for the current page' })
  docs: Model[];

  @ApiProperty({ description: 'Total number of documents available', example: 100 })
  total: number;

  @ApiProperty({ description: 'Number of documents per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Current page number', example: 1, required: false })
  page?: number;

  @ApiProperty({ description: 'Total number of pages', example: 10, required: false })
  pages?: number;

  @ApiProperty({ description: 'Offset of documents for the current page', example: 0, required: false })
  offset?: number;
}
