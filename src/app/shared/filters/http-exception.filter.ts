import { Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  env: string;

  constructor(private configService: ConfigService) {
    this.env = this.configService.get<string>('app.env');
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message;

    if (status === 500) {
      message = 'Internal server error';
    } else {
      message = 'An error occurred';
    }

    response.status(status).json({
      statusCode: status,
      type: this.env === 'development' ? exception.name : undefined,
      message: this.env === 'development' ? exception.message : message,
    });
  }
}
