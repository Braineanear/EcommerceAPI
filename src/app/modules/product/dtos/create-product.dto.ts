import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

class DetailsDto {
  [key: string]: any;
}

export class CreateProductDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Product name',
    example: 'Product 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product description',
    example: 'Product 1 description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Category ID of product',
    example: 'e23fc2342gwsdsad5t43hsghbfdg34',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Brand ID of product',
    example: 'e23fc2342gwsdsad5t43hsghbfdg34',
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Product price',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product currency',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Product quantity',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Size ID for product',
    example: 'e23fc2342gwsdsad5t43hsghbfdg34',
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Color ID for product',
    example: 'e23fc2342gwsdsad5t43hsghbfdg34',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    type: [String],
    required: true,
    description: 'Tag ID for product',
    example: [
      'e23fc2342gwsdsad5t43hsghbfdg34',
      'e23fc2342gwsdsad5t43hsghbfdg35',
    ],
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @ValidateNested()
  @Type(() => DetailsDto)
  details?: DetailsDto;
}
