import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    maxLength: 500,
    minLength: 10,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
