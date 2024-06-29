import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address of the user requesting password reset',
    example: 'user@example.com',
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
