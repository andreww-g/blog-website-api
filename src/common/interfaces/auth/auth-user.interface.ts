import { UserRoleEnum } from '../../enums/user-role.enum';


export interface IAuthUser {
  userId: string,
  role: UserRoleEnum,
}
