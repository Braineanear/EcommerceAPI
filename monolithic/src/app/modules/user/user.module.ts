import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';

import { ImageModule } from '@modules/image/image.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';

import { User, UserSchema, UserDocument } from './models/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.pre<UserDocument>('save', function (next: NextFunction) {
            const user = this;

            if (!user.isModified('password')) {
              return next();
            }

            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                return next(err);
              }

              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                  return next(err);
                }

                user.password = hash;
                return next();
              });
            });
          });

          return schema;
        },
      },
    ]),
    forwardRef(() => AwsModule),
    forwardRef(() => ImageModule),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
