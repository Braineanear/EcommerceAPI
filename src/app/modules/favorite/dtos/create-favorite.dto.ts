import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFavoriteDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Product ID',
  })
  @IsString()
  @IsNotEmpty()
  product: Types.ObjectId;
}
