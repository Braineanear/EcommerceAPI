import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date in ISO 8601 format',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    description: 'End date in ISO 8601 format',
    example: '2023-12-31T23:59:59.999Z',
  })
  @IsDateString()
  to: string;
}
