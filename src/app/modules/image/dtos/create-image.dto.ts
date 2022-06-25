import { PartialType } from '@nestjs/swagger';
import { ImageDto } from './image.dto';

export class CreateImageDto extends PartialType(ImageDto) {}
