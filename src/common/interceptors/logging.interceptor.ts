import {
  CallHandler,
  ExecutionContext, HttpException, HttpStatus,
  Injectable,
  Logger,
  NestInterceptor, Scope,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthValidateService } from '../../auth/services/auth-validate.service';
import { AuthTokenTypeEnum } from '../enums/auth-token-type.enum';
import { UserRoleEnum } from '../enums/user-role.enum';
import { InvalidCredentialsException } from '../exception/invalid-credentials.exception';


@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor (private readonly authValidateService: AuthValidateService) {}

  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body: payload, headers } = request;

    const authHeader = headers['authorization'];
    const accessToken =
      authHeader?.match(/bearer ([\w.-]*)/i)[1] ?? query['_accessToken'];

    const now = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const time = Date.now() - now;

        await this.logRequest(method, url, statusCode, time, accessToken, payload);
      }),
      catchError(async (err) => {
        const statusCode =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const time = Date.now() - now;

        await this.logRequest(method, url, statusCode, time, accessToken, payload, err.message );

        throw err;
      }),
    );
  }

  private async logRequest (
    method: string,
    url: string,
    statusCode: number,
    time: number,
    accessToken: string,
    payload: object,
    errorNotice?: string | any,
  ) {
    if (accessToken) {
      let errorMessage: string | null;
      const { id } = await this.authorizeAdmin(accessToken);
      const payloadString = Object.values(payload).length > 0 ? this.stringifyPayload(payload) : null;
      const payloadMessage = payloadString ? `Payload: ${payloadString}` : null;

      const logMessage = `${method} ${url} ${statusCode}, Time: ${time}ms, Admin ID: ${id}`;

      if (errorNotice && typeof errorNotice === 'string') {
        errorMessage = `Error: ${errorNotice}`;
      } else if (errorNotice && errorNotice instanceof Error) {
        errorMessage = `Error: ${errorNotice.message}`;
      } else if (errorNotice && typeof errorNotice === 'object') {
        errorMessage = `Error: ${JSON.stringify(errorNotice)}`;
      } else {
        errorMessage = null;
      }

      if (errorMessage) this.logger.error(errorMessage);
      this.logger.log(logMessage);
      if (payloadString) this.logger.log(payloadMessage);
    }
  }

  private async authorizeAdmin (accessToken: string) {
    const admin = await this.authValidateService.validate(accessToken, AuthTokenTypeEnum.ACCESS_TOKEN, UserRoleEnum.ADMIN);

    if (!admin) {
      throw new InvalidCredentialsException();
    }

    return admin;
  }

  private stringifyPayload (payload: any) {
    const set = new WeakSet();

    return JSON.stringify(payload, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (set.has(value)) {
          return '[Circular]';
        }
        set.add(value);
      }
      return value;
    });
  }
}
