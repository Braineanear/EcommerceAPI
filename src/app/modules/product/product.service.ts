import { Types } from 'mongoose';
import slugify from 'slugify';

import { BrandService } from '@modules/brand/brand.service';
import { CategoryService } from '@modules/category/category.service';
import { ColorService } from '@modules/color/color.service';
import { ImageService } from '@modules/image/image.service';
import { SizeService } from '@modules/size/size.service';
import { TagService } from '@modules/tag/tag.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import {
  IProductDocument,
  IProductImage,
} from './interfaces/product.interface';
import { ProductRepository } from './repositories/product.repository';
import { IImageDocument } from '@modules/image/interfaces/image.interface';

@Injectable()
export class ProductService extends BaseService<ProductRepository> {
  constructor(
    protected readonly repository: ProductRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
    protected readonly categoryService: CategoryService,
    protected readonly brandService: BrandService,
    protected readonly sizeService: SizeService,
    protected readonly tagService: TagService,
    protected readonly colorService: ColorService,
  ) {
    super();
  }
  private isEmptyObj = function (obj) {
    return Object.keys(obj).length === 0;
  };
  async create(createProductDto: CreateProductDto): Promise<IProductDocument> {
    try {
      if (this.isEmptyObj(createProductDto))
        throw new HttpException(
          'Data is empty!!!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      const data = {
        ...createProductDto,
        slug: slugify(createProductDto.name, {
          replacement: '-',
          remove: /[*+~.()'"!:@]/g,
          lower: true,
        }),
      };
      return this.repository.create(data);
    } catch (error) {
      throw new HttpException(
        'Server is out of reach!!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateById(
    id: string | Types.ObjectId,
    data: UpdateProductDto,
  ): Promise<IProductDocument> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    if (data.details) {
      Object.keys(data.details).forEach((key) => {
        if (data.details[key] === '') {
          delete data.details[key];
        } else {
          item.details[key] = data.details[key];
        }
      });

      data.details = item.details;
    }

    return this.repository.updateById(id, data);
  }

  async getMainProductImage(
    id: string | Types.ObjectId,
  ): Promise<IImageDocument> {
    const product = this.repository.findById(id);
    const mainImageId = (await product).mainImage;
    return await this.imageService.findById(mainImageId);
  }

  async uploadMainImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IProductImage> {
    const product = await this.findById(id);
    const content: Buffer = file.buffer;
    const name = product._id;
    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      name,
      content,
      {
        path: `images/products`,
      },
    );

    const imageDoc = await this.imageService.create(aws);
    const res = await this.repository.updateById(id, {
      mainImage: imageDoc._id,
    });
    // return res;
    // success: boolean;
    // alt: string;
    // message: string;
    // imageUrl: string;

    return {
      message: 'Image uploaded successfuly',
      success: true,
      imageUrl:
        'https://ecomm.ams3.digitaloceanspaces.com/' + aws.pathWithFilename,
    };
  }

  async uploadImages(
    id: string | Types.ObjectId,
    files: Express.Multer.File[],
  ): Promise<IProductDocument> {
    const product = await this.findById(id);
    let counter = 1;

    for (const file of files) {
      const content: Buffer = file.buffer;
      const name = `sub-${product._id.toString()}-${counter++}`;
      const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
        name,
        content,
        {
          path: `images/products`,
        },
      );

      const imageDoc = await this.imageService.create(aws);

      product.images.push(imageDoc._id.toString());
    }

    await product.save();

    return product;
  }

  async deleteMainImage(
    id: string | Types.ObjectId,
  ): Promise<IProductDocument> {
    const product = await this.findById(id);
    const image = await this.imageService.findById(product.mainImage);

    if (!product.mainImage) {
      throw new HttpException(MessagesMapping['#22'], HttpStatus.NOT_FOUND);
    }

    await this.imageService.deleteById(product.mainImage);

    await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

    product.mainImage = undefined;

    await product.save();

    return product;
  }

  async deleteSubImage(
    id: string | Types.ObjectId,
    imageId: string | Types.ObjectId,
  ): Promise<IProductDocument> {
    const product = await this.findById(id);
    const exist = product.images.find(
      (image) => image._id.toString() === imageId.toString(),
    );

    if (!exist) {
      throw new HttpException(MessagesMapping['#23'], HttpStatus.NOT_FOUND);
    }

    const image = await this.imageService.findById(imageId);

    await this.imageService.deleteById(imageId);

    await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

    product.images = product.images.filter(
      (image) => image._id.toString() !== imageId.toString(),
    );

    await product.save();

    return product;
  }
}
