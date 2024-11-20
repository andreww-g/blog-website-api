import { UserRoleEnum } from '../../enums/user-role.enum';


export interface IAuthUser {
  authorId: string,
  role: UserRoleEnum,
}
