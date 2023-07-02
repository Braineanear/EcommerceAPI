import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ type: String, required: true, description: 'Tag name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Tag code',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
