import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { UserDto } from './user.dto';

export class PaginatedUserDto extends PaginatedResponseDto<UserDto> {
  docs: UserDto[];
}
