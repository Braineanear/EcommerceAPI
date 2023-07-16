import { Module } from '@nestjs/common';

import { AwsS3Service } from './aws.service';

@Module({
  exports: [AwsS3Service],
  providers: [AwsS3Service],
  controllers: [],
})
export class AwsModule {}
