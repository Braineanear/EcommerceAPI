import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'New Password',
    example: '123456',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Confirm Password',
    example: '123456',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  passwordConfirmation: string;
}
