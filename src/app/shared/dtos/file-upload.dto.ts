import { ApiProperty } from '@nestjs/swagger';

export class SingleFileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class MultipleFilesUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}
