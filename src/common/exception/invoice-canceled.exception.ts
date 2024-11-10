import { BadRequestException } from '@nestjs/common';


export class InvoiceCanceledException extends BadRequestException {
  constructor (message: string) {
    super({
      message: message,
    });
  }
}
