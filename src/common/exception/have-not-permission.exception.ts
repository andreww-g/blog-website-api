import { BadRequestException } from '@nestjs/common';


export class HaveNotPermissionException extends BadRequestException {
  constructor (permission: string) {
    super({
      message: `permission ${permission} required`,
    });
  }
}
