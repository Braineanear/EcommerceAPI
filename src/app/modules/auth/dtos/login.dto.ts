import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    type: String,
    required: true,
    uniqueItems: true,
    format: 'email',
    minLength: 5,
    maxLength: 60,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
    type: String,
    required: true,
    minLength: 6,
    maxLength: 60,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
