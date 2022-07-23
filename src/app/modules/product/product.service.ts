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
import { CategoryService } from '@modules/category/category.service';
import { ColorService } from '@modules/color/color.service';
import { BrandService } from '@modules/brand/brand.service';
import { SizeService } from '@modules/size/size.service';
import { ProductRepository } from './repositories/product.repository';
import { FindProductsDto } from './dtos/find-products.dto';
import { IProductDocument } from './interfaces/product.interface';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    protected readonly repository: ProductRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
    protected readonly categoryService: CategoryService,
    protected readonly brandService: BrandService,
    protected readonly sizeService: SizeService,
    protected readonly colorService: ColorService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<IProductDocument> {
    const category = await this.categoryService.findOne({
      name: createProductDto.category,
    });

    if (!category) {
      this.debuggerService.error(
        'Category not found',
        'ProductService',
        'create',
      );

      throw new NotFoundException('Category not found');
    }

    createProductDto.category = category._id;

    const brand = await this.brandService.findOne({
      code: createProductDto.brand,
    });

    if (!brand) {
      this.debuggerService.error('Brand not found', 'ProductService', 'create');

      throw new NotFoundException('Brand not found');
    }

    createProductDto.brand = brand._id;

    const sizes = await this.sizeService.find({
      code: {
        $in: createProductDto.sizes,
      },
    });

    if (sizes.length === 0) {
      this.debuggerService.error('Sizes not found', 'ProductService', 'create');

      throw new NotFoundException('Sizes not found');
    }

    createProductDto.sizes = sizes.map((size) => size._id);

    const colors = await this.colorService.find({
      code: {
        $in: createProductDto.colors,
      },
    });

    if (colors.length === 0) {
      this.debuggerService.error(
        'Colors not found',
        'ProductService',
        'create',
      );

      throw new NotFoundException('Colors not found');
    }

    createProductDto.colors = colors.map((color) => color._id);

    return this.repository.create(createProductDto);
  }

  async findById(id: string | Types.ObjectId): Promise<IProductDocument> {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `Product with id: ${id} not found`,
        'ProductService',
        'findById',
      );

      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    return result;
  }

  async findOne(
    filter: FilterQuery<IProductDocument>,
  ): Promise<IProductDocument> {
    const result = await this.repository.findOne(filter);

    if (!result) {
      this.debuggerService.error(
        'Product not found',
        'ProductService',
        'findOne',
      );

      throw new NotFoundException('Product not found');
    }

    return result;
  }

  async findPaginated(
    filter: FindProductsDto,
    paginateOptions: IPaginateOptions,
  ): Promise<IPaginatedInterface<IProductDocument>> {
    return this.repository.paginate(filter, paginateOptions);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<IProductDocument>,
  ): Promise<IProductDocument> {
    const result = await this.repository.updateById(id, update);

    if (!result) {
      this.debuggerService.error(
        `Product with id: ${id} not found`,
        'ProductService',
        'updateById',
      );

      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<void> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `Product with id: ${id} not found`,
        'ProductService',
        'deleteById',
      );

      throw new NotFoundException(`Product with id: ${id} not found`);
    }
  }

  async uploadMainImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IProductDocument> {
    const product = await this.repository.findById(id);

    if (!product) {
      this.debuggerService.error(
        'Product not found',
        'ProductService',
        'uploadImage',
      );

      throw new NotFoundException('Product not found');
    }

    if (product.mainImage) {
      const image = await this.imageService.findById(product.mainImage);

      if (!image) {
        this.debuggerService.error(
          'Image not found',
          'ProductService',
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
          'ProductService',
          'uploadImage',
        );

        throw new InternalServerErrorException('Error deleting image');
      }

      await this.imageService.deleteById(image._id);
    }

    const content: Buffer = file.buffer;

    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      product._id,
      content,
      {
        path: `images/products`,
      },
    );

    const imageDoc = await this.imageService.create(aws);

    return this.repository.updateById(id, {
      mainImage: imageDoc._id,
    });
  }

  async uploadImages(
    id: string | Types.ObjectId,
    files: Express.Multer.File[],
  ): Promise<IProductDocument> {
    const product = await this.repository.findById(id);

    if (!product) {
      this.debuggerService.error(
        'Product not found',
        'ProductService',
        'uploadImage',
      );

      throw new NotFoundException('Product not found');
    }

    for (const file of files) {
      const content: Buffer = file.buffer;

      const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
        product._id.toString(),
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
}
