import { BadRequestException } from '@nestjs/common';


export class InvalidRecaptchaException extends BadRequestException {
  constructor () {
    super({
      message: 'invalid recaptcha',
    });
  }
}
