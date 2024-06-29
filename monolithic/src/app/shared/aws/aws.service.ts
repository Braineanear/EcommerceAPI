import sharp from 'sharp';
import { Readable } from 'stream';

import {
    CreateBucketCommand,
    DeleteBucketCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ListBucketsCommand,
    ListObjectsV2Command,
    ObjectCannedACL,
    ObjectIdentifier,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { IAwsS3Response } from './interfaces/aws.interface';

@Injectable()
export class AwsS3Service implements OnModuleInit {
    private readonly s3Client: S3Client;
    private readonly bucket: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly debuggerService: DebuggerService,
    ) {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: this.configService.get<string>('aws.credential.key'),
                secretAccessKey: this.configService.get<string>('aws.credential.secret'),
            },
            region: this.configService.get<string>('aws.s3.region'),
        });

        this.bucket = this.configService.get<string>('aws.s3.bucket');
    }

    async onModuleInit(): Promise<void> {
        const bucketCreate = this.configService.get<boolean>('aws.bucketCreate');
        if (bucketCreate) {
            try {
                const list = await this.s3ListBucket();
                if (!list.includes(this.bucket)) {
                    await this.s3CreateBucket();
                }
            } catch (e) {
                throw new InternalServerErrorException(`Error initializing bucket: ${e.message}`);
            }
        }
    }

    private async handleError(e: any, methodName: string): Promise<void> {
        this.debuggerService.error(e, 'AwsS3Service', methodName);
        throw new InternalServerErrorException(e.message);
    }

    async s3ListBucket(): Promise<string[]> {
        try {
            const command = new ListBucketsCommand({});
            const listBucket = await this.s3Client.send(command);
            return listBucket.Buckets.map((bucket: { Name: string }) => bucket.Name);
        } catch (e) {
            await this.handleError(e, 's3ListBucket');
        }
    }

    async s3ListItemInBucket(prefix?: string): Promise<IAwsS3Response[]> {
        try {
            const command = new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix });
            const listItems = await this.s3Client.send(command);
            return listItems.Contents.map((item: { Key: string }) => {
                const lastIndex = item.Key.lastIndexOf('/');
                const path = item.Key.substring(0, lastIndex);
                const filename = item.Key.substring(lastIndex + 1);
                const mime = filename.substring(filename.lastIndexOf('.') + 1).toUpperCase();
                return { path, pathWithFilename: item.Key, filename, mime };
            });
        } catch (e) {
            await this.handleError(e, 's3ListItemInBucket');
        }
    }

    async s3GetItemInBucket(filename: string, path?: string): Promise<Buffer> {
      try {
          if (path) path = path.startsWith('/') ? path.slice(1) : path;
          const key = path ? `${path}/${filename}` : filename;
          const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
          const item = await this.s3Client.send(command);

          return await this.streamToBuffer(item.Body as Readable);
      } catch (e) {
          await this.handleError(e, 's3GetItemInBucket');
      }
    }

    private async streamToBuffer(stream: Readable): Promise<Buffer> {
      return new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('error', reject);
          stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    }

    async s3PutItemInBucket(
        filename: string,
        content: Buffer | string,
        options: { path?: string; acl?: ObjectCannedACL } = {}
    ): Promise<IAwsS3Response> {
        try {
            const { path = '', acl = 'public-read' as ObjectCannedACL } = options;
            const key = `${path}/${filename}.png`.replace(/^\/+/, '');
            content = await sharp(content)
                .resize({ fit: sharp.fit.fill, width: 330, height: 330 })
                .toFormat('png')
                .toBuffer();
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: content,
                ACL: acl
            });
            await this.s3Client.send(command);
            return { path, pathWithFilename: key, filename, mime: 'PNG' };
        } catch (e) {
            await this.handleError(e, 's3PutItemInBucket');
        }
    }

    async s3DeleteItemInBucket(filename: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: filename });
            await this.s3Client.send(command);
        } catch (e) {
            await this.handleError(e, 's3DeleteItemInBucket');
        }
    }

    async s3DeleteItemsInBucket(filenames: string[]): Promise<void> {
        try {
            const keys: ObjectIdentifier[] = filenames.map((key) => ({ Key: key }));
            const command = new DeleteObjectsCommand({ Bucket: this.bucket, Delete: { Objects: keys } });
            await this.s3Client.send(command);
        } catch (e) {
            await this.handleError(e, 's3DeleteItemsInBucket');
        }
    }

    async s3DeleteBucket(): Promise<void> {
        try {
            const command = new DeleteBucketCommand({ Bucket: this.bucket });
            await this.s3Client.send(command);
        } catch (e) {
            await this.handleError(e, 's3DeleteBucket');
        }
    }

    async s3CreateBucket(): Promise<void> {
        try {
            const command = new CreateBucketCommand({ Bucket: this.bucket });
            await this.s3Client.send(command);
        } catch (e) {
            await this.handleError(e, 's3CreateBucket');
        }
    }
}
