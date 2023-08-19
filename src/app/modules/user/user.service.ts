import { Types } from 'mongoose';

import { ImageService } from '@modules/image/image.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateUserDto } from './dtos/create-user.dto';
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
  async getLoggedinUserDetails(userId: string): Promise<IUserDocument> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    user.password = undefined;

    return user;
  }

  async deleteLoggedinUserDetails(userId: string): Promise<IUserDocument> {
    const user = await this.repository.deleteById(userId);

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async uploadImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IUserDocument> {
    console.log(id);
    const user = await this.repository.findById(id);

    if (user.avatar) {
      const image = await this.imageService.findById(user.avatar);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

      await this.imageService.deleteById(image._id);
    }

    const content: Buffer = file.buffer;
    console.log(content);
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

  async uploadLoggedinUserImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<IUserDocument> {
    const user = await this.repository.deleteById(userId);

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

    return this.repository.updateById(user._id, {
      avatar: imageDoc._id,
    });
  }

  async create(userDto: CreateUserDto): Promise<IUserDocument> {
    const user = await this.repository.create(userDto);

    return user;
  }
}
