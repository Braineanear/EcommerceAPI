import { Types } from 'mongoose';

import { ImageService } from '@modules/image/image.service';
import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { BaseService } from '@shared/services/base.service';

import { IUserDocument } from './interfaces/user.interface';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService extends BaseService<UserRepository> {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
  ) {
    super();
  }

  async uploadImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IUserDocument> {
    const user = await this.findById(id);

    if (user.avatar) {
      const image = await this.imageService.findById(user.avatar);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

      await this.imageService.deleteById(image._id);
    }

    const content: Buffer = file.buffer;

    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      user._id,
      content,
      {
        path: `images/users`,
      },
    );

    const imageDoc = await this.imageService.create(aws);

    return this.repository.updateById(id, {
      avatar: imageDoc._id,
    });
  }
}
