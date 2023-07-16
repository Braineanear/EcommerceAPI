import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'messageCode',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Response status code',
    example: 200,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Response type',
    example: 'success',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  type: string;
}
