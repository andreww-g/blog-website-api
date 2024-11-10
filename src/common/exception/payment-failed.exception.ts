import { BadRequestException } from '@nestjs/common';


export class PaymentFailedException extends BadRequestException {
  constructor (transactionMessage: string) {
    super({
      message: `Payment Failed: ${transactionMessage}`,
    });
  }
}
