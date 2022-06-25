import { Prop } from '@nestjs/mongoose';

export class Location {
  @Prop({ type: String, required: true, example: 'Point', enum: ['Point'] })
  type: string;

  @Prop({ type: [Number], required: true, example: [0, 0] })
  coordinates: number[];
}
