import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { AwsS3Service } from '@shared/aws/aws.service';
import { ImageService } from '@modules/image/image.service';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ICategoryDocument } from './interfaces/category.interface';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';

@Injectable()
export class CategoryService {
  constructor(
    protected readonly repository: CategoryRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
  ) {}

  async findById(id: string) {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Category with id: ${id} not found`,
        'CategoryService',
        'findById',
      );

      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    return result;
  }

  async findOne(filter: object) {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error(
        'Category not found',
        'CategoryService',
        'findOne',
      );

      throw new NotFoundException('Category not found');
    }

    return result;
  }

  async find(filter: object) {
    const results = await this.repository.find(filter);

    if (results.length === 0) {
      this.debuggerService.error(
        'Categories not found',
        'CategoryService',
        'find',
      );

      throw new NotFoundException('Categories not found');
    }

    return results;
  }

  async findPaginated(filter: object, paginateOptions) {
    return this.repository.findPaginated(filter, paginateOptions);
  }

  async updateById(id: string, update: object) {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `Category with id: ${id} not found`,
        'CategoryService',
        'updateById',
      );

      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Category with id: ${id} not found`,
        'CategoryService',
        'deleteById',
      );

      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    return result;
  }

  async create(doc: CreateCategoryDto) {
    return this.repository.create(doc);
  }

  async uploadImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<ICategoryDocument> {
    const category = await this.repository.findById(id);

    if (!category) {
      this.debuggerService.error(
        'Category not found',
        'CategoryService',
        'uploadImage',
      );

      throw new NotFoundException('Category not found');
    }

    if (category.image) {
      const image = await this.imageService.findById(category.image);

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
          'CityService',
          'uploadImage',
        );

        throw new InternalServerErrorException('Error deleting image');
      }

      await this.imageService.deleteById(image._id);
    }

    const content: Buffer = file.buffer;

    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      category._id,
      content,
      {
        path: `images/categories`,
      },
    );

    const imageDoc = await this.imageService.create(aws);

    return this.repository.updateById(id, {
      avatar: imageDoc._id,
    });
  }
}
