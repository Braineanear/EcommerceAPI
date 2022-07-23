import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty({ type: String, required: true, description: 'Size name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Size code',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
