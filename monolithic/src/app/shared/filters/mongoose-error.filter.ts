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

interface MongoErrorWithDetails extends MongoError {
  errors?: any;
}

@Catch(MongoError)
export class MongooseErrorFilter implements ExceptionFilter {
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

    const statusCode =
      exception.code === 11000
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception.code === 11000
        ? 'Duplicate key error'
        : 'Internal server error';

    response.status(statusCode).json({
      statusCode,
      type: exception.name,
      message,
      errors: this.env === 'development' ? this.parseError(exception) : undefined,
    });
  }

  private parseError(error: MongoErrorWithDetails): any {
    return error.errors ? error.errors : error;
  }
}
