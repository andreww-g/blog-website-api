import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { IS_PUBLISHER_AUTH } from '../../constants/auth';

export const AuthPublisher = () => applyDecorators(ApiBearerAuth(), SetMetadata(IS_PUBLISHER_AUTH, true));
