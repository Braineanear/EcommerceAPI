import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Initial Product',
  })
  @IsString()
  @IsNotEmpty()
  product: Types.ObjectId;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Quantity',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
