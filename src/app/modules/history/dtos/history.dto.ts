import { PartialType } from '@nestjs/swagger';

import { History } from '../models/history.entity';

export class HistoryDto extends PartialType(History) {}
