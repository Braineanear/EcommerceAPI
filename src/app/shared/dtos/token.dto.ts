import { IsNotEmpty, IsString } from 'class-validator';

class AccessTokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  expires: string;
}

class RefreshTokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  expires: string;
}

export class TokenDTO {
  access: AccessTokenDTO;
  refresh: RefreshTokenDTO;
}
