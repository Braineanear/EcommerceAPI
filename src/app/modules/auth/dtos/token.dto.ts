import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Refresh Token',
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}
