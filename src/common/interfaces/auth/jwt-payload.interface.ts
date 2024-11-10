import { AuthTokenTypeEnum } from '../../enums/auth-token-type.enum';
import { UserRoleEnum } from '../../enums/user-role.enum';


export interface JwtPayloadInterface {
  sub: string,

  role: UserRoleEnum,

  type: AuthTokenTypeEnum,

  iat?: number,

  exp?: number,
}
