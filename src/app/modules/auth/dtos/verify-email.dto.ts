import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Email Token',
  })
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
