import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { ConfigService } from 'src/config/config.service';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { ZodError } from 'zod';

import { HttpExceptionTypeEnum } from '../enums/http-exception-type.enum';


@Catch()
export class AllExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);
  private readonly configService = new ConfigService();

  catch (exception: Error | ZodValidationException, host: ArgumentsHost) {
    const { statusCode, response } = this.handleException(exception);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const responseContext = ctx.getResponse();

    this.logger.error({
      path: request.url,
      method: request.method,
      exception: exception.message,
      stack: exception.stack,
      statusCode,
    });

    return responseContext.status(statusCode).json(response);
  }

  private handleException (exception: Error | ZodValidationException) {
    if (
      exception instanceof InternalServerErrorException &&
      (exception as any).error instanceof ZodError
    ) {
      return this.handleZodSerializationException(
        exception as InternalServerErrorException & { error: ZodError },
      );
    }

    if (exception instanceof ZodValidationException)
    {return this.handleZodValidationException(exception);}

    if (exception instanceof HttpException)
    {return this.handleHttpException(exception);}

    if (exception instanceof TypeORMError)
    {return this.handleTypeormException(exception);}

    return this.handleUnknownException(exception);
  }

  private handleHttpException (exception: HttpException) {
    const { message, data } =
      (exception.getResponse() as {
        message: string,
        data?: Record<string, string>,
      }) || {};
    const statusCode =
      exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorType = Object.keys(HttpStatus).find(
      (key) => HttpStatus[key] === statusCode,
    );

    return {
      statusCode,
      response: {
        message,
        errorType,
        data,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleUnknownException (exception: Error) {
    if (
      Object.values(HttpExceptionTypeEnum).includes(
        (exception as any)?.errorType,
      )
    ) {
      return this.handleHttpException(
        new HttpException(exception, (exception as any).statusCode),
      );
    }

    this.logger.error(exception);

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      response: {
        errorType: HttpExceptionTypeEnum.INTERNAL_SERVER_ERROR,
        message: exception.message || 'Unexpected error',
        data: null,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleZodValidationException (exception: ZodValidationException) {
    return {
      statusCode: exception.getStatus(),
      response: {
        errorType: exception.getStatus(),
        message: exception.getZodError(),
        data: null,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleZodSerializationException (
    exception: InternalServerErrorException & { error: ZodError },
  ) {
    return {
      statusCode: exception.getStatus(),
      response: {
        errorType: exception.getStatus(),
        message: this.configService.isDevelopment
          ? exception.error
          : 'Error during serializing response.',
        data: null,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleTypeormException (exception: TypeORMError) {
    const { statusCode, errorType } = this.getTypeormErrorStatusCode(exception);

    return {
      statusCode,
      response: {
        errorType,
        message: exception.message,
        data: null,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private getTypeormErrorStatusCode (exception: TypeORMError) {
    const errorType = exception.constructor.name;

    const defaultResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorType: HttpExceptionTypeEnum.INTERNAL_SERVER_ERROR,
    };

    if (errorType === 'EntityNotFoundError') {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        errorType: HttpExceptionTypeEnum.NOT_FOUND,
      };
    }

    if (
      errorType === 'QueryFailedError' &&
      exception.message.includes(
        'duplicate key value violates unique constraint',
      )
    ) {
      return {
        statusCode: HttpStatus.CONFLICT,
        errorType: HttpExceptionTypeEnum.CONFLICT,
      };
    }

    return defaultResponse;
  }
}
