import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Write your review',
  })
  @IsString()
  @IsNotEmpty()
  review: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Write your rating',
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product ID',
  })
  @IsString()
  @IsNotEmpty()
  product: string;
}
