import { PartialType } from '@nestjs/swagger';

import { Favorite } from '../models/favorite.entity';

export class FavoriteDto extends PartialType(Favorite) {}
