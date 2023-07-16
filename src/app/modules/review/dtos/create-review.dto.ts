import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Write your review',
    example: 'This is a review',
  })
  @IsString()
  @IsNotEmpty()
  review: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Write your rating',
    example: '5',
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product ID',
    example: 'e23fc2342gwsdsad5t43hsghbfdg34',
  })
  @IsString()
  @IsNotEmpty()
  product: string;
}
