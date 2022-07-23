import { PartialType } from '@nestjs/swagger';
import { CreateColorDto } from './create-color.dto';

export class UpdateColorDto extends PartialType(CreateColorDto) {}
