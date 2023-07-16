import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export class RegisterDto {
  @ApiProperty({
    description: 'First name',
    example: 'John',
    maxLength: 50,
    minLength: 2,
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    maxLength: 50,
    minLength: 2,
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Role',
    enum: RoleTypeEnum,
    example: RoleTypeEnum.User,
    type: String,
    required: true,
  })
  role: RoleTypeEnum;

  @ApiProperty({
    description: 'Email',
    example: 'be@example.com',
    maxLength: 50,
    minLength: 5,
    type: String,
    required: true,
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
    maxLength: 50,
    minLength: 6,
    type: String,
    required: true,
  })
  password: string;
}
