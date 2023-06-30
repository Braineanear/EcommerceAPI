import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true, description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String, required: true, description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: String, required: true, description: 'User email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true, description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User role',
    enum: Object.values(RoleTypeEnum),
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(RoleTypeEnum)
  role: RoleTypeEnum;

  @ApiProperty({
    type: String,
    required: false,
    description: 'User address',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'User phone',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'User company name',
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'User website URL',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'User bio',
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
