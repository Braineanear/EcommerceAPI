import { PartialType } from '@nestjs/swagger';

import { Category } from '../models/category.entity';

export class CategoryDto extends PartialType(Category) {}
