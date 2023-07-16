import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: RoleTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  isEmailVerified: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;

  @IsNotEmpty()
  passwordChangedAt?: Date;

  @IsString()
  address?: string;

  @IsString()
  phone?: string;

  @IsString()
  website?: string;

  @IsString()
  company?: string;

  @IsString()
  bio?: string;

  @IsString()
  avatar: string;
}
