import { isArray } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { DEFAULT_LANGUAGE } from '../constants/app.config';
import { LanguageEnum } from '../enums/language.enum';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class TranslateInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const language: string =
      request.headers['accept-language'] &&
      Object.values(LanguageEnum).includes(request.headers['accept-language'])
        ? request.headers['accept-language']
        : request.query.language
        ? request.query.language
        : DEFAULT_LANGUAGE;

    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return;
        }
        if (data.docs && isArray(data.docs)) {
          data.docs = TranslationService.translateDocs(data.docs, language);
        } else {
          data = TranslationService.translate(data, language);
        }
        return data;
      }),
    );
  }
}
