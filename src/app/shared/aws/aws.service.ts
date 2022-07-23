import {
  S3Client,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  CreateBucketCommand,
  DeleteObjectsCommand,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAwsS3Response } from './interfaces/aws.interface';

@Injectable()
export class AwsS3Service implements OnModuleInit {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.credential.key'),
        secretAccessKey: this.configService.get<string>(
          'aws.credential.secret',
        ),
      },
      region: this.configService.get<string>('aws.s3.region'),
    });

    this.bucket = this.configService.get<string>('aws.s3.bucket');
  }

  async onModuleInit(): Promise<void> {
    const bucketCreate: boolean =
      this.configService.get<boolean>('aws.bucketCreate');
    if (bucketCreate) {
      this.s3ListBucket().then((list: string[]) => {
        if (!list.includes(this.bucket)) {
          this.s3CreateBucket();
        }
      });
    }
  }

  async s3ListBucket(): Promise<string[]> {
    const command: ListBucketsCommand = new ListBucketsCommand({});
    const listBucket: Record<string, any> = await this.s3Client.send(command);
    return listBucket.Buckets.map((val: Record<string, any>) => val.Name);
  }

  async s3ListItemInBucket(prefix?: string): Promise<IAwsS3Response[]> {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });
    const listItems: Record<string, any> = await this.s3Client.send(command);

    return listItems.Contents.map((val: Record<string, any>) => {
      const lastIndex: number = val.Key.lastIndexOf('/');
      const path: string = val.Key.substring(0, lastIndex);
      const filename: string = val.Key.substring(lastIndex, val.Key.length);
      const mime: string = filename
        .substring(filename.lastIndexOf('.') + 1, filename.length)
        .toLocaleUpperCase();

      return {
        path,
        pathWithFilename: val.Key,
        filename: filename,
        mime,
      };
    });
  }

  async s3GetItemInBucket(
    filename: string,
    path?: string,
  ): Promise<Record<string, any>> {
    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

    const key: string = path ? `${path}/${filename}` : filename;
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const item: Record<string, any> = await this.s3Client.send(command);

    return item.Body;
  }

  async s3PutItemInBucket(
    filename: string,
    content:
      | Buffer
      | Uint8Array
      | Uint8ClampedArray
      | Int8Array
      | Uint16Array
      | Int16Array
      | Uint32Array
      | Int32Array
      | Float32Array
      | Float64Array
      | string,
    options: Record<string, any>,
  ): Promise<IAwsS3Response> {
    let path: string = options && options.path ? options.path : undefined;
    const acl: string = options && options.acl ? options.acl : 'public-read';

    options.path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

    const key: string = `${path}/${filename}.png`;
    content = await sharp(content, {})
      .resize({
        fit: sharp.fit.fill,
        width: 330,
        height: 330,
      })
      .toFormat('png')
      .toBuffer();

    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
      ACL: acl,
    });

    await this.s3Client.send(command);

    return {
      path,
      pathWithFilename: key,
      filename: filename,
      mime: 'PNG',
    };
  }

  async s3DeleteItemInBucket(filename: string): Promise<boolean> {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (e) {
      return false;
    }
  }

  async s3DeleteItemsInBucket(filenames: string[]): Promise<boolean> {
    const keys: ObjectIdentifier[] = filenames.map((val) => ({
      Key: val,
    }));
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: {
        Objects: keys,
      },
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (e) {
      return false;
    }
  }

  async s3DeleteBucket(): Promise<boolean> {
    const command: DeleteBucketCommand = new DeleteBucketCommand({
      Bucket: this.bucket,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (e) {
      return false;
    }
  }

  async s3CreateBucket(): Promise<boolean> {
    const command: CreateBucketCommand = new CreateBucketCommand({
      Bucket: this.bucket,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (e) {
      return false;
    }
  }
}
