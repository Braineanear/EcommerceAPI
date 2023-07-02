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

@Catch(MongoError)
export class MongooseErrorFilter implements ExceptionFilter {
  env: string;

  constructor(
    public reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.env = this.configService.get<string>('app.env');
  }

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 11000:
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          type: exception.name,
          message: 'Duplicate key error',
          errors:
            this.env === 'development' ? this.parseError(exception) : undefined,
        });
        break;
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          type: exception.name,
          message: 'Internal server error',
          errors:
            this.env === 'development' ? this.parseError(exception) : undefined,
        });
        break;
    }
  }
  parseError(error) {
    return error.errors ? error.errors : error;
  }
}
