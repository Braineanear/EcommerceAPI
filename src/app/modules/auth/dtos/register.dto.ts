import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export class RegisterDto {
  firstName: string;
  lastName: string;
  role: RoleTypeEnum;
  email: string;
  password: string;
}
