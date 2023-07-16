import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email',
    example: 'be@example.com',
    maxLength: 50,
    minLength: 5,
    type: String,
    required: true,
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
