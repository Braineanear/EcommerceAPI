import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the brand',
    example: 'Nike',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Code of the brand',
    example: 'nike',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Description of the brand',
    example:
      'Nike is the world’s leading innovator in athletic footwear, apparel, equipment and accessories.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Website of the brand',
    required: false,
    example: 'https://www.nike.com/',
  })
  @IsString()
  @IsOptional()
  website?: string;
}
