import { merge } from 'lodash';
import { DEFAULT_LANGUAGE } from '../constants/app.config';
import {
  ITranslationDocument,
  ITranslationModel,
} from '../interfaces/translation.interface';

export class TranslationService {
  static translate(doc: ITranslationDocument | any, language: string) {
    doc = JSON.parse(JSON.stringify(doc));

    if (doc.translation) {
      if (language === DEFAULT_LANGUAGE) {
        this.removeTranslations(doc);
        return doc;
      }

      const translation = this.getTranslation(doc, language);
      if (translation) {
        merge(doc, translation);
        this.removeTranslations(doc);
      }
    }

    return doc;
  }

  static translateDocs(
    docs: ITranslationDocument[] | ITranslationModel[],
    language: string,
  ) {
    return docs.map((doc: any) => TranslationService.translate(doc, language));
  }

  static reduceTranslation(doc: ITranslationModel) {
    return doc.translation.reduce((acc, t) => {
      acc[t.language] = t;
      return acc;
    }, {});
  }

  private static getTranslation(doc: any, language: string) {
    return doc.toObject
      ? doc.toObject({ virtuals: false }).translation.find(
          (tr) => tr.language === language,
        )
      : doc.translation.find((tr) => tr.language === language);
  }

  private static removeTranslations(doc: any) {
    doc.translation = undefined;

    if (doc.currency) {
      doc.currency.translation = undefined;
    }

    if (doc.country) {
      doc.country.translation = undefined;
      if (doc.country.currency) {
        doc.country.currency.translation = undefined;
      }
    }

    if (doc.state) {
      doc.state.translation = undefined;
      if (doc.state.country) {
        doc.state.country.translation = undefined;
        if (doc.state.country.currency) {
          doc.state.country.currency.translation = undefined;
        }
      }
    }

    if (doc.city) {
      doc.city.translation = undefined;
      if (doc.city.state) {
        doc.city.state.translation = undefined;
        if (doc.city.state.country) {
          doc.city.state.country.translation = undefined;
          if (doc.city.state.country.currency) {
            doc.city.state.country.currency.translation = undefined;
          }
        }
      }

      if (doc.city.country) {
        doc.city.country.translation = undefined;
        if (doc.city.country.currency) {
          doc.city.country.currency.translation = undefined;
        }
      }
    }
  }
}
