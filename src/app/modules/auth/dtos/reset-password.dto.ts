import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'New Passowrd',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Confirm Password',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;
}
