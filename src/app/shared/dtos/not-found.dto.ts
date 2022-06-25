import { ApiProperty } from '@nestjs/swagger';

export class NotFoundDto {
  @ApiProperty({
    type: String,
    description: 'The status code',
    example: '404',
  })
  status: string;

  @ApiProperty({
    type: String,
    description: 'The error message',
    example: 'The requested resource was not found',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'The error',
    example: 'Not Found',
  })
  error: string;
}
