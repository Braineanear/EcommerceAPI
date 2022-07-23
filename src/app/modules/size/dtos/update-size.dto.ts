import { PartialType } from '@nestjs/swagger';
import { CreateSizeDto } from './create-size.dto';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {}
