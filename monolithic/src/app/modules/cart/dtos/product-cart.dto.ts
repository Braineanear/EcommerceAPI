import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export class ProductCartDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Product ID',
  })
  @IsString()
  @IsNotEmpty()
  product: Types.ObjectId;
}
