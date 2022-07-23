import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Address {
  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  zip: string;
}
