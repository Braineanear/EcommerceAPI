import { PartialType } from '@nestjs/swagger';

import { Order } from '../models/order.entity';

export class OrderDto extends PartialType(Order) {}
