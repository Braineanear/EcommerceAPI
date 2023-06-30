import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestWithUser } from '@shared/interfaces/requestWithUser.interface';
import { LoggerService } from '@shared/logger/logger.service';

@Injectable({ scope: Scope.REQUEST })
export class DebuggerService {
  constructor(
    @Inject(REQUEST) private req: RequestWithUser,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly loggerService: LoggerService,
  ) {}

  info(
    description: string,
    sClass: string,
    sFunction: string,
    data?: any,
  ): void {
    this.logger.info(description, {
      class: sClass,
      function: sFunction,
      data,
    });
  }

  debug(
    description: string,
    sClass: string,
    sFunction: string,
    data?: any,
  ): void {
    this.logger.debug(description, {
      class: sClass,
      function: sFunction,
      data,
    });
  }

  error(
    description: string,
    sClass: string,
    sFunction: string,
    error?: any,
  ): void {
    this.logger.error(description, {
      class: sClass,
      function: sFunction,
      error,
    });

    this.loggerService.error({
      description,
      user: this.req.user ? this.req.user._id : null,
      tags: [sClass, sFunction],
    });
  }
}
