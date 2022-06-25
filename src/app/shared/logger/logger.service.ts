import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { LoggerRepository } from './repositories/logger.repository';
import { ILoggerDocument } from './interfaces/logger.interface';
import { ENUM_LOGGER_LEVEL } from './enums/logger.enum';
import { CreateLoggerDto } from './dtos/create-logger.dto';

@Injectable()
export class LoggerService {
  private readonly testMode: boolean;

  constructor(
    private readonly repository: LoggerRepository,
    private readonly configService: ConfigService,
  ) {
    this.testMode = this.configService.get<string>('app.env') === 'testing';
  }

  info({ description, user, tags }: CreateLoggerDto): Promise<ILoggerDocument> {
    if (this.testMode) {
      return;
    }

    return this.repository.create({
      level: ENUM_LOGGER_LEVEL.INFO,
      user: new Types.ObjectId(user),
      anonymous: user ? false : true,
      description,
      tags,
    });
  }

  debug({
    description,
    user,
    tags,
  }: CreateLoggerDto): Promise<ILoggerDocument> {
    if (this.testMode) {
      return;
    }

    return this.repository.create({
      level: ENUM_LOGGER_LEVEL.DEBUG,
      user: new Types.ObjectId(user),
      anonymous: user ? false : true,
      description,
      tags,
    });
  }

  warning({
    description,
    user,
    tags,
  }: CreateLoggerDto): Promise<ILoggerDocument> {
    if (this.testMode) {
      return;
    }

    return this.repository.create({
      level: ENUM_LOGGER_LEVEL.WARM,
      user: new Types.ObjectId(user),
      anonymous: user ? false : true,
      description,
      tags,
    });
  }

  error({
    description,
    user,
    tags,
  }: CreateLoggerDto): Promise<ILoggerDocument> {
    if (this.testMode) {
      return;
    }

    return this.repository.create({
      level: ENUM_LOGGER_LEVEL.ERROR,
      user: new Types.ObjectId(user),
      anonymous: user ? false : true,
      description,
      tags,
    });
  }
}
