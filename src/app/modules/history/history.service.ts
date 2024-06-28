import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { HistoryRepository } from './repositories/history.repository';
import { HistoryDocument } from './models/history.entity';

@Injectable()
export class HistoryService extends BaseService<HistoryDocument, HistoryRepository> {
  constructor(
    protected readonly repository: HistoryRepository,
    protected readonly debuggerService: DebuggerService,
  ) {
    super();
  }

  public async deleteHistory(id: string, user: HistoryDocument) {
    const history = await this.findById(id);

    if (history.user.toString() !== user._id.toString()) {
      throw new HttpException(MessagesMapping['#24'], HttpStatus.FORBIDDEN);
    }

    return this.repository.deleteById(id);
  }
}
