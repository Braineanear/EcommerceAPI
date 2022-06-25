import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { LanguageEnum } from '../enums/language.enum';

export class TranslationDto {
  @ApiProperty({
    type: String,
    required: true,
    example: LanguageEnum.en,
    description: 'Language',
  })
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Cairo International Airport',
    description: 'Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
