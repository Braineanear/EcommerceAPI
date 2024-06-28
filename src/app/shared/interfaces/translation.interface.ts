import { Document } from 'mongoose';

export interface ITranslation {
  language: string;
  name: string;
}
export interface ITranslationModel {
  translation: ITranslation[];
}
export type ITranslationDocument = Document &
  ITranslationModel &
  Record<string, unknown>;
