import { PartialType } from '@nestjs/swagger';
import { Image } from '../models/image.entity';

export class ImageDto extends PartialType(Image) {}
