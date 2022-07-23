import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the color',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Code of the color',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
