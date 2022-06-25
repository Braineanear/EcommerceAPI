import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, UpdateQuery, Types } from 'mongoose';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { UserRepository } from './repositories/user.repository';
import { FindUsersDto } from './dtos/find-users.dto';
import { IUserDocument } from './interfaces/user.interface';
import { IPaginatedInterface } from '@shared/interfaces/i-paginate-result.interface';

@Injectable()
export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly debuggerService: DebuggerService,
  ) {}

  create(createUserDto: Partial<IUserDocument>): Promise<IUserDocument> {
    return this.repository.create(createUserDto);
  }

  async findById(id: string | Types.ObjectId): Promise<IUserDocument> {
    const result = await this.repository.findById(id);

    if (!result) {
      this.debuggerService.error(
        `User ${id} not found`,
        'UserService',
        'findById',
      );

      throw new NotFoundException(`User ${id} not found`);
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
        `User ${id} not found`,
        'UserService',
        'updateById',
      );

      throw new NotFoundException(`User ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<void> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      this.debuggerService.error(
        `User ${id} not found`,
        'UserService',
        'deleteById',
      );

      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
