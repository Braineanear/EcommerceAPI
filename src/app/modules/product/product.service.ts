import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { BaseService } from '@shared/services/base.service';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { ImageService } from '@modules/image/image.service';
import { CategoryService } from '@modules/category/category.service';
import { ColorService } from '@modules/color/color.service';
import { BrandService } from '@modules/brand/brand.service';
import { TagService } from '@modules/tag/tag.service';
import { SizeService } from '@modules/size/size.service';
import { ProductRepository } from './repositories/product.repository';
import { IProductDocument } from './interfaces/product.interface';
import { CreateProductDto } from './dtos/create-product.dto';

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

  async create(createProductDto: CreateProductDto): Promise<IProductDocument> {
    const category = await this.categoryService.findOne({
      code: createProductDto.category,
    });

    createProductDto.category = category._id;

    const [brands, sizes, colors, tags] = await Promise.all([
      this.brandService.find({
        $in: {
          code: createProductDto.brands,
        },
      }),
      this.sizeService.find({
        code: {
          $in: createProductDto.sizes,
        },
      }),
      this.colorService.find({
        code: {
          $in: createProductDto.colors,
        },
      }),
      this.tagService.find({
        code: {
          $in: createProductDto.tags,
        },
      }),
    ]);

    return this.repository.create({
      ...createProductDto,
      brands: brands.map((brand) => brand._id),
      sizes: sizes.map((size) => size._id),
      colors: colors.map((color) => color._id),
      tags: tags.map((tag) => tag._id),
      slug: slugify(createProductDto.name, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      }),
    });
  }

  async uploadMainImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IProductDocument> {
    const product = await this.findById(id);

    if (product.mainImage) {
      const image = await this.imageService.findById(product.mainImage);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

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
    const product = await this.findById(id);

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
