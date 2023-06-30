import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'New Passowrd',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Confirm Password',
  })
  @IsString()
  @IsNotEmpty()
  readonly passwordConfirmation: string;
}
