import { PartialType } from '@nestjs/swagger';

import { Size } from '../models/size.entity';

export class SizeDto extends PartialType(Size) {}
