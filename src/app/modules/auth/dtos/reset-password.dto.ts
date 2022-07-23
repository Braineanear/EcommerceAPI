import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Reset Token',
  })
  @IsString()
  @IsNotEmpty()
  readonly token: string;

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
