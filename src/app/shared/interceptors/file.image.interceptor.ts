import { Observable } from 'rxjs';

import {
    CallHandler, ExecutionContext, Injectable, NestInterceptor, PayloadTooLargeException,
    UnprocessableEntityException, UnsupportedMediaTypeException
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';

import { ENUM_FILE_IMAGE_MIME, ENUM_FILE_STATUS_CODE_ERROR } from '../enums/file.enum';

@Injectable()
export class FileImageInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const { file, files } = ctx.getRequest();

    const finalFiles = files || file;

    if (Array.isArray(finalFiles)) {
      const maxFiles = this.configService.get<number>('file.maxFiles');

      if (finalFiles.length > maxFiles) {
        throw new UnprocessableEntityException({
          statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_ERROR,
          message: 'file.error.maxFiles',
        });
      }

      for (const file of finalFiles) {
        await this.validate(file);
      }
    } else {
      await this.validate(finalFiles);
    }

    return next.handle();
  }

  async validate(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new UnprocessableEntityException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_NEEDED_ERROR,
        message: 'file.error.notFound',
      });
    }

    const { size, mimetype } = file;

    const maxSize = this.configService.get<number>('file.maxFileSize');
    if (
      !Object.values(ENUM_FILE_IMAGE_MIME).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: 'file.error.mimeInvalid',
      });
    } else if (size > maxSize) {
      throw new PayloadTooLargeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_SIZE_ERROR,
        message: 'file.error.maxSize',
      });
    }
  }
}
