import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AccessTokenDTO {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Access token expiry date',
    example: '2024-07-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsString()
  expires: string;
}

class RefreshTokenDTO {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Refresh token expiry date',
    example: '2024-07-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsString()
  expires: string;
}

export class TokenDTO {
  @ApiProperty({ type: AccessTokenDTO })
  access: AccessTokenDTO;

  @ApiProperty({ type: RefreshTokenDTO })
  refresh: RefreshTokenDTO;
}
