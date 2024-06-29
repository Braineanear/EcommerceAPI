import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedUserDto extends PaginatedResponseDto<UserDto> {
  @ApiProperty({ type: [UserDto], description: 'List of users' })
  docs: UserDto[];
}
