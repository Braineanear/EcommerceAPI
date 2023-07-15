import { ProductService } from '@modules/product/product.service';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { BaseService } from '@shared/services/base.service';

import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FavoriteRepository } from './repositories/favorite.repository';

@Injectable()
export class FavoriteService extends BaseService<FavoriteRepository> {
  constructor(
    protected readonly repository: FavoriteRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly productService: ProductService,
  ) {
    super();
  }

  async findFavorites(
    filter: object,
    paginateOptions: IPaginateOptions,
    user: IUserDocument,
  ) {
    filter = {
      ...filter,
      user: user._id,
    };

    return this.repository.paginate(filter, paginateOptions);
  }

  async create(doc: CreateFavoriteDto, user: IUserDocument) {
    await this.productService.findById(doc.product);

    let favoriteDoc = await this.repository.findOne({
      user: user._id,
      product: doc.product,
    });

    if (favoriteDoc) {
      throw new ConflictException(
        `Product with id ${doc.product.toString()} already exists in favorite`,
      );
    } else {
      favoriteDoc = await this.repository.create({
        user: user._id,
        product: doc.product,
      });
    }

    return favoriteDoc;
  }
}
