import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the brand',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Code of the brand',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Description of the brand',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Website of the brand',
    required: false,
  })
  @IsString()
  @IsOptional()
  website?: string;
}
