import { Prop } from '@nestjs/mongoose';

export class NameRef {
  @Prop({ type: String })
  name: string;
}
