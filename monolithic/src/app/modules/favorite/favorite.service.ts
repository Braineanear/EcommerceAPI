import { ProductService } from '@modules/product/product.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';
import { UserDocument } from '@modules/user/models/user.entity';

import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FavoriteRepository } from './repositories/favorite.repository';
import { FavoriteDocument } from './models/favorite.entity';

@Injectable()
export class FavoriteService extends BaseService<FavoriteDocument, FavoriteRepository> {
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
    user: UserDocument,
  ) {
    filter = {
      ...filter,
      user: user._id,
    };

    return this.repository.paginate(filter, paginateOptions);
  }

  async create(doc: CreateFavoriteDto, user: UserDocument) {
    await this.productService.findById(doc.product);

    let favoriteDoc = await this.repository.findOne({
      user: user._id,
      product: doc.product,
    });

    if (favoriteDoc) {
      throw new HttpException(MessagesMapping['#18'], HttpStatus.CONFLICT);
    } else {
      favoriteDoc = await this.repository.create({
        user: user._id,
        product: doc.product,
      });
    }

    return favoriteDoc;
  }
}
