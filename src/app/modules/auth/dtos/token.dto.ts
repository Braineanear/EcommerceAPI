import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

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
