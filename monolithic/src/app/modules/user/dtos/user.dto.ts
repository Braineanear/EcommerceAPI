import { PartialType } from '@nestjs/swagger';

import { User } from '../models/user.entity';

export class UserDto extends PartialType(User) {}
