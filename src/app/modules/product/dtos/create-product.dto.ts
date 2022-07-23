import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @ApiProperty({ type: String, required: true, description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product category',
  })
  @IsString()
  @IsNotEmpty()
  category: string | Types.ObjectId;

  @ApiProperty({ type: String, required: true, description: 'Product brand' })
  @IsString()
  @IsNotEmpty()
  brand: string | Types.ObjectId;

  @ApiProperty({ type: Number, required: true, description: 'Product price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Product quantity',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    type: Number,
    default: 0,
    description: 'Product discount',
  })
  @IsNumber()
  @IsOptional()
  priceDiscount: number;

  @ApiProperty({ type: [String], required: true, description: 'Product sizes' })
  @IsString()
  @IsNotEmpty()
  sizes: string[] | Types.ObjectId[];

  @ApiProperty({
    type: [String],
    required: true,
    description: 'Product colors',
  })
  @IsString()
  @IsNotEmpty()
  colors: string[] | Types.ObjectId[];

  @ApiProperty({ type: [String], required: true, description: 'Product tags' })
  @IsString()
  @IsNotEmpty()
  tags: string[] | Types.ObjectId[];
}
