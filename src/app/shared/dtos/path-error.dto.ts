import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PathErrorDto {
  @ApiProperty({
    description: 'The path where the error occurred',
    example: '/api/v1/resource',
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: 'The status code of the error',
    example: 404,
  })
  @IsInt()
  status: number;

  @ApiProperty({
    description: 'The error message',
    example: 'Resource not found',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Optional error code',
    example: 'ERR_NOT_FOUND',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;
}
