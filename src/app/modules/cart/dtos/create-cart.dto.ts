import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCartDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

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

  @ApiProperty({
    type: String,
    required: true,
    description: 'Size',
  })
  @IsString()
  @IsNotEmpty()
  size: Types.ObjectId;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Color',
  })
  @IsString()
  @IsNotEmpty()
  color: Types.ObjectId;
}
