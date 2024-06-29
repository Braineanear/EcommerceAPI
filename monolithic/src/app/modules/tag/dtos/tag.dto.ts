import { PartialType } from '@nestjs/swagger';

import { Tag } from '../models/tag.entity';

export class TagDto extends PartialType(Tag) {}
