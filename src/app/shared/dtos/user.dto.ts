import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export class UserDTO {
  @ApiProperty({
    description: 'User ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'securepassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: RoleTypeEnum,
    example: RoleTypeEnum.User,
  })
  @IsEnum(RoleTypeEnum)
  @IsNotEmpty()
  role: RoleTypeEnum;

  @ApiProperty({
    description: 'Indicates whether the email is verified',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Indicates whether the user is deleted',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;

  @ApiPropertyOptional({
    description: 'Timestamp when the password was last changed',
    example: '2024-07-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  passwordChangedAt?: Date;

  @ApiPropertyOptional({
    description: 'Address of the user',
    example: '123 Main St, Anytown, USA',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Website of the user',
    example: 'https://www.example.com',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    description: 'Company of the user',
    example: 'Example Inc.',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    description: 'Bio of the user',
    example: 'A brief bio of the user.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Avatar image URL of the user',
    example: 'https://www.example.com/avatar.jpg',
  })
  @IsString()
  @IsNotEmpty()
  avatar: string;
}
