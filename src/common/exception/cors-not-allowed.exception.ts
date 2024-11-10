import { HttpException, HttpStatus } from '@nestjs/common';


export class CorsNotAllowedException extends HttpException {
  constructor (message = 'CORS Not Allowed') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
