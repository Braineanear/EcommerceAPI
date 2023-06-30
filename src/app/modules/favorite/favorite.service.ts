import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { ProductService } from '@modules/product/product.service';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { FavoriteRepository } from './repositories/favorite.repository';
import { CreateFavoriteDto } from './dtos/create-favorite.dto';

@Injectable()
export class FavoriteService extends BaseService<FavoriteRepository> {
  constructor(
    protected readonly repository: FavoriteRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly productService: ProductService,
  ) {
    super();
  }

  async create(doc: CreateFavoriteDto, user: IUserDocument) {
    await this.productService.findById(doc.product);

    let favoriteDoc = await this.repository.findOne({
      user: user._id,
    });

    if (favoriteDoc) {
      const indexFound = favoriteDoc.products.findIndex(
        (item) => item.toString() === doc.product.toString(),
      );

      if (indexFound === -1) {
        favoriteDoc.products.push(doc.product);

        await favoriteDoc.save();
      } else {
        this.debuggerService.error(
          `Product with id ${doc.product.toString()} already exists in favorite`,
          'FavoriteService',
          'create',
        );

        throw new NotFoundException(
          `Product with id ${doc.product.toString()} already exists in favorite`,
        );
      }
    } else {
      favoriteDoc = await this.repository.create({
        user: user._id,
        products: [doc.product],
      });
    }

    return favoriteDoc;
  }

  async deleteFavoriteProduct(productId: string, user: IUserDocument) {
    const favoriteDoc = await this.repository.findOne({
      user: user._id,
    });

    if (favoriteDoc) {
      const indexFound = favoriteDoc.products.findIndex(
        (item) => item.toString() === productId.toString(),
      );

      if (indexFound !== -1) {
        favoriteDoc.products.splice(indexFound, 1);

        await favoriteDoc.save();
      } else {
        this.debuggerService.error(
          `Product with id ${productId.toString()} not found in favorite`,
          'FavoriteService',
          'deleteFavoriteItem',
        );

        throw new NotFoundException(
          `Product with id ${productId.toString()} not found in favorite`,
        );
      }
    } else {
      this.debuggerService.error(
        `Favorite list not found`,
        'FavoriteService',
        'deleteFavoriteItem',
      );

      throw new NotFoundException(`Favorite not found`);
    }

    return favoriteDoc;
  }
}
