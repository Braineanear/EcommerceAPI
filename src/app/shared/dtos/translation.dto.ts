import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LanguageEnum } from '../enums/language.enum';

export class TranslationDto {
  @ApiProperty({
    description: 'Language of the translation',
    example: LanguageEnum.en,
    enum: LanguageEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(LanguageEnum)
  language: LanguageEnum;

  @ApiProperty({
    description: 'Name in the specified language',
    example: 'Cairo International Airport',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
