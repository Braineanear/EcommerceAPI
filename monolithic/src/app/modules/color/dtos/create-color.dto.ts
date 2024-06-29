import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateColorDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the color',
    example: 'Red',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Code of the color',
    example: '#ff0000',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
