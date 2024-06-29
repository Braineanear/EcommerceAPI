import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Initial Product',
    example: '5f9d88b9d4b7c1f9c8f9d9b9',
  })
  @IsString()
  @IsNotEmpty()
  product: Types.ObjectId;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Quantity',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
