import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
  },
})
export class Image {
  @Prop({ type: String })
  path: string;

  @Prop({ type: String })
  pathWithFilename: string;

  @Prop({ type: String })
  filename: string;

  @Prop({ type: String })
  mime: string;
}

const ImageSchema = SchemaFactory.createForClass(Image);

type ImageDocument = Image & Document;

ImageSchema.virtual('url').get(function (this: ImageDocument) {
  return process.env.AWS_S3_BASE_URL + '/' + this.pathWithFilename;
});

export { ImageSchema };
