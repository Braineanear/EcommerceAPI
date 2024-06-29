import { PartialType } from '@nestjs/swagger';

import { Brand } from '../models/brand.entity';

export class BrandDto extends PartialType(Brand) {}
