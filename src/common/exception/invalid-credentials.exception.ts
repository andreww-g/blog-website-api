import { BadRequestException } from '@nestjs/common';


export class InvalidCredentialsException extends BadRequestException {
  constructor () {
    super({
      message: 'invalid credentials',
    });
  }
}
