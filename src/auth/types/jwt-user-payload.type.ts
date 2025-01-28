import { AuthTokenTypeEnum } from '../../common/enums/auth-token-type.enum';
import { UserRoleEnum } from '../../common/enums/user-role.enum';

export type JwtUserPayloadType = {
  sub: string;
  role: UserRoleEnum;
  type: AuthTokenTypeEnum;
  email: string;
  iat?: number;
  exp?: number;
};
