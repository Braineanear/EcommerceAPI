import { merge } from 'lodash';

import { DEFAULT_LANGUAGE } from '../constants/app.config';
import { ITranslationDocumnet, ITranslationModel } from '../interfaces/translation.interface';

export class TranslationService {
  static translate(doc: ITranslationDocumnet | any, language: string) {
    doc = JSON.parse(JSON.stringify(doc));
    if (doc.translation) {
      if (language == DEFAULT_LANGUAGE) {
        doc.translation = undefined;
        if (doc.currency) {
          doc.currency.translation = undefined;
        }

        if (doc.country) {
          doc.country.translation = undefined;
          doc.country.currency.translation = undefined;
        }

        if (doc.state) {
          doc.state.translation = undefined;
          doc.state.country.translation = undefined;
          doc.state.country.currency.translation = undefined;
        }

        if (doc.city) {
          doc.city.translation = undefined;
          if (doc.city.state) {
            doc.city.state.translation = undefined;
            doc.city.state.country.translation = undefined;
            doc.city.state.country.currency.translation = undefined;
          } else if (doc.city.country) {
            doc.city.country.translation = undefined;
            doc.city.country.currency.translation = undefined;
          }
        }

        return doc;
      }
      const translation = doc.toObject
        ? doc
            .toObject({ virtuals: false })
            .translation.find((tr) => tr.language == language)
        : doc.translation.find((tr) => tr.language == language);
      merge(doc, translation);
      doc.translation = undefined;

      if (doc.currency) {
        merge(
          doc.currency,
          doc.currency.translation.find((tr) => tr.language == language),
        );
        doc.currency.translation = undefined;
      }

      if (doc.country) {
        merge(
          doc.country,
          doc.country.translation.find((tr) => tr.language == language),
        );
        doc.country.translation = undefined;
        if (doc.country.currency) {
          merge(
            doc.country.currency,
            doc.country.currency.translation.find(
              (tr) => tr.language == language,
            ),
          );
          doc.country.currency.translation = undefined;
        }
      }

      if (doc.state) {
        merge(
          doc.state,
          doc.state.translation.find((tr) => tr.language == language),
        );
        doc.state.translation = undefined;
        if (doc.state.country) {
          merge(
            doc.state.country,
            doc.state.country.translation.find((tr) => tr.language == language),
          );
          doc.state.country.translation = undefined;
          if (doc.state.country.currency) {
            merge(
              doc.state.country.currency,
              doc.state.country.currency.translation.find(
                (tr) => tr.language == language,
              ),
            );
            doc.state.country.currency.translation = undefined;
          }
        }
      }

      if (doc.city) {
        merge(
          doc.city,
          doc.city.translation.find((tr) => tr.language == language),
        );
        doc.city.translation = undefined;
        if (doc.city.state) {
          merge(
            doc.city.state,
            doc.city.state.translation.find((tr) => tr.language == language),
          );
          doc.city.state.translation = undefined;
          if (doc.city.state.country) {
            merge(
              doc.city.state.country,
              doc.city.state.country.translation.find(
                (tr) => tr.language == language,
              ),
            );
            doc.city.state.country.translation = undefined;
            if (doc.city.state.country.currency) {
              merge(
                doc.city.state.country.currency,
                doc.city.state.country.currency.translation.find(
                  (tr) => tr.language == language,
                ),
              );
              doc.city.state.country.currency.translation = undefined;
            }
          }
        }

        if (doc.city.country) {
          merge(
            doc.city.country,
            doc.city.country.translation.find((tr) => tr.language == language),
          );
          doc.city.country.translation = undefined;
          if (doc.city.country.currency) {
            merge(
              doc.city.country.currency,
              doc.city.country.currency.translation.find(
                (tr) => tr.language == language,
              ),
            );
            doc.city.country.currency.translation = undefined;
          }
        }
      }
    }
    return doc;
  }

  static translateDocs(
    docs: ITranslationDocumnet[] | ITranslationModel[],
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
}
