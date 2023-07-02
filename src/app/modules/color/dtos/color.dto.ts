import { PartialType } from '@nestjs/swagger';

import { Color } from '../models/color.entity';

export class ColorDto extends PartialType(Color) {}
