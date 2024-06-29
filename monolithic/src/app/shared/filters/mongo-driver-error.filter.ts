import { Response } from 'express';
import { MongoError } from 'mongodb';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { MongoErrorCodes } from '../constants/mongo-error-codes.constant';
import { PathErrorDto } from '../dtos/path-error.dto';

@Catch(MongoError)
export class MongoDriverErrorFilter implements ExceptionFilter {
  private readonly env: string;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.env = this.configService.get<string>('app.env', 'production');
  }

  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception.code && MongoErrorCodes[exception.code]
        ? MongoErrorCodes[exception.code]
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: status,
      message: HttpStatus[status],
      errors: this.env === 'development' ? this.parseError(exception) : undefined,
    });
  }

  private parseError(error: MongoError): PathErrorDto[] {
    const status = MongoErrorCodes[error.code] || HttpStatus.SERVICE_UNAVAILABLE;

    const path = this.env === 'development' && this.hasKeyPattern(error)
    ? Object.keys(error.keyPattern).join(',')
    : undefined;


    return [
      {
        status,
        message: this.env === 'development' ? error.message : undefined,
        path,
        code: error.code as string,
      },
    ];
  }

  private hasKeyPattern(error: MongoError): error is MongoError & { keyPattern: Record<string, any> } {
    return 'keyPattern' in error;
  }

}
