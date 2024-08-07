import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
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
  @MaxLength(50)
  @MinLength(2)
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
  @MaxLength(50)
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'Role',
    enum: RoleTypeEnum,
    example: RoleTypeEnum.User,
    type: String,
    required: true,
  })
  @IsNotEmpty()
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
  @IsEmail()
  @MaxLength(50)
  @MinLength(5)
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
    maxLength: 50,
    minLength: 6,
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(6)
  password: string;
}
