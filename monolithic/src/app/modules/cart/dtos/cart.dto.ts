import { PartialType } from '@nestjs/swagger';
import { Cart } from '../models/cart.entity';

export class CartDto extends PartialType(Cart) {}
