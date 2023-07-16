import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Code of the category',
    example: 'CAT-001',
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the category',
    example: 'Category 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Description of the category',
    example: 'Category 1 description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
