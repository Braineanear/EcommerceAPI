import { Types } from 'mongoose';

import { ImageService } from '@modules/image/image.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateCategoryDto } from './dtos/create-category.dto';
import { ICategoryDocument } from './interfaces/category.interface';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CategoryService extends BaseService<CategoryRepository> {
  constructor(
    protected readonly repository: CategoryRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
  ) {
    super();
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ICategoryDocument> {
    const result = await this.repository.create(createCategoryDto);

    return result;
  }

  async uploadImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<ICategoryDocument> {
    const category = await this.findById(id);

    if (category.image) {
      const image = await this.imageService.findById(category.image);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

      await this.imageService.deleteById(image._id);
    }

    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      category._id,
      file.buffer,
      {
        path: `images/categories`,
      },
    );

    const imageDoc = await this.imageService.create(aws);

    category.image = imageDoc._id;

    await category.save();

    return category;
  }

  async deleteById(id: string | Types.ObjectId): Promise<ICategoryDocument> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    if (result.image) {
      const image = await this.imageService.findById(result.image);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

      await this.imageService.deleteById(image._id);

      result.image = undefined;
    }

    return result;
  }
}
