import { isArray } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { DEFAULT_LANGUAGE } from '../constants/app.config';
import { LanguageEnum } from '../enums/language.enum';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class TranslateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const language: string = this.determineLanguage(request);

    return next.handle().pipe(
      map((data) => this.translateResponse(data, language)),
    );
  }

  private determineLanguage(request: any): string {
    const headerLanguage = request.headers['accept-language'];
    const queryLanguage = request.query.language;

    if (headerLanguage && Object.values(LanguageEnum).includes(headerLanguage)) {
      return headerLanguage;
    }

    if (queryLanguage && Object.values(LanguageEnum).includes(queryLanguage)) {
      return queryLanguage;
    }

    return DEFAULT_LANGUAGE;
  }

  private translateResponse(data: any, language: string): any {
    if (!data) {
      return data;
    }

    if (data.docs && isArray(data.docs)) {
      data.docs = TranslationService.translateDocs(data.docs, language);
    } else {
      data = TranslationService.translate(data, language);
    }

    return data;
  }
}
