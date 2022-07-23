import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, UpdateQuery, Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { ImageService } from '@modules/image/image.service';
import { UserRepository } from './repositories/user.repository';
import { FindUsersDto } from './dtos/find-users.dto';
import { IUserDocument } from './interfaces/user.interface';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
  ) {}

  create(createUserDto: Partial<IUserDocument>): Promise<IUserDocument> {
    return this.repository.create(createUserDto);
  }

  async findById(id: string | Types.ObjectId): Promise<IUserDocument> {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `User with id: ${id} not found`,
        'UserService',
        'findById',
      );

      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: FilterQuery<IUserDocument>): Promise<IUserDocument> {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error('User not found', 'UserService', 'findOne');

      throw new NotFoundException('User not found');
    }

    return result;
  }

  async findPaginated(
    filter: FindUsersDto,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IUserDocument>> {
    return this.repository.paginate(filter, paginateOptions);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IUserDocument>,
  ): Promise<IUserDocument> {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `User with id: ${id} not found`,
        'UserService',
        'updateById',
      );

      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<void> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `User with id: ${id} not found`,
        'UserService',
        'deleteById',
      );

      throw new NotFoundException(`User with id: ${id} not found`);
    }
  }

  async uploadImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IUserDocument> {
    const user = await this.repository.findOne({
      _id: id,
    });

    if (!user) {
      this.debuggerService.error(
        'User not found',
        'UserService',
        'uploadImage',
      );

      throw new NotFoundException('User not found');
    }

    if (user.avatar) {
      const image = await this.imageService.findById(user.avatar);

      if (!image) {
        this.debuggerService.error(
          'Image not found',
          'UserService',
          'uploadImage',
        );

        throw new NotFoundException('Image not found');
      }

      const isDeleted = await this.awsService.s3DeleteItemInBucket(
        image.pathWithFilename,
      );

      if (!isDeleted) {
        this.debuggerService.error(
          'Image not deleted',
          'UserService',
          'uploadImage',
        );

        throw new InternalServerErrorException('Error deleting image');
      }

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
