import { UserRoleEnum } from '../../enums/user-role.enum';

export interface IAuthUser {
  id: string,
  role: UserRoleEnum,
}
