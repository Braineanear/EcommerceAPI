import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  PayloadTooLargeException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { ENUM_FILE_IMAGE_MIME, ENUM_FILE_STATUS_CODE_ERROR } from '../enums/file.enum';

@Injectable()
export class FileImageInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const request = ctx.getRequest();
    const { file, files } = request;
    const finalFiles = files || file;

    if (Array.isArray(finalFiles)) {
      await this.validateFiles(finalFiles);
    } else {
      await this.validateFile(finalFiles);
    }

    return next.handle();
  }

  private async validateFiles(files: Express.Multer.File[]): Promise<void> {
    const maxFiles = this.configService.get<number>('file.maxFiles');

    if (files.length > maxFiles) {
      throw new UnprocessableEntityException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_ERROR,
        message: 'file.error.maxFiles',
      });
    }

    for (const file of files) {
      await this.validateFile(file);
    }
  }

  private async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new UnprocessableEntityException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_NEEDED_ERROR,
        message: 'file.error.notFound',
      });
    }

    const { size, mimetype } = file;
    const maxSize = this.configService.get<number>('file.maxFileSize');

    if (!this.isValidMimeType(mimetype)) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: 'file.error.mimeInvalid',
      });
    }

    if (size > maxSize) {
      throw new PayloadTooLargeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_SIZE_ERROR,
        message: 'file.error.maxSize',
      });
    }
  }

  private isValidMimeType(mimetype: string): boolean {
    return Object.values(ENUM_FILE_IMAGE_MIME).includes(mimetype.toLowerCase() as ENUM_FILE_IMAGE_MIME);
  }
}
