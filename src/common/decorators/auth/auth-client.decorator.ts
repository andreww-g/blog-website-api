import { applyDecorators, SetMetadata } from '@nestjs/common';

import { IS_CLIENT_AUTH } from '../../constants/auth';


export const AuthClient = () => applyDecorators(
  SetMetadata(IS_CLIENT_AUTH, true),
);
