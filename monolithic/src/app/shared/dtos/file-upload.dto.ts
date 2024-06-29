import { ApiProperty } from '@nestjs/swagger';

export class SingleFileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'A single file to upload' })
  file: Express.Multer.File;
}

export class MultipleFilesUploadDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Multiple files to upload'
  })
  files: Express.Multer.File[];
}
