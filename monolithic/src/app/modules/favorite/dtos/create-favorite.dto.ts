import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Product ID',
    example: '5f8d0f4d8d6c8b2d9c7e2b4f',
  })
  @IsString()
  @IsNotEmpty()
  product: Types.ObjectId;
}
