import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

class DetailsDto {
  [key: string]: any;
}

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
  category: string;

  @ApiProperty({ type: String, required: false, description: 'Product brand' })
  @IsString()
  @IsOptional()
  brand?: string;

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

  @ApiProperty({ type: String, required: false, description: 'Product size' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Product color',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ type: [String], required: true, description: 'Product tags' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @ValidateNested()
  @Type(() => DetailsDto)
  details?: DetailsDto;
}
