import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@shared/dtos/success-response.dto';
import { TokenDTO } from '@shared/dtos/token.dto';
import { UserDTO } from '@shared/dtos/user.dto';

export class LoginResponseDTO extends SuccessResponseDto {
  @ApiProperty({
    description: 'User Data',
    type: UserDTO,
  })
  user: UserDTO;

  @ApiProperty({
    description: 'JWT Tokens',
    type: TokenDTO,
  })
  tokens: TokenDTO;
}
