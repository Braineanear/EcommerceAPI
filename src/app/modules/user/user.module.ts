import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './models/user.entity';
import { IUserDocument } from './interfaces/user.interface';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<IUserDocument>('save', function (next: NextFunction) {
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

          schema.pre('findOne', function () {
            const query = this.getQuery();
            if (query.isDeleted == null) {
              query.isDeleted = false;
            }
            if (query.isVerified == null) {
              query.isVerified = true;
            }
          });

          schema.pre('find', function () {
            const query = this.getQuery();
            if (query.isDeleted == null) {
              query.isDeleted = false;
            }
            if (query.isVerified == null) {
              query.isVerified = true;
            }
          });

          return schema;
        },
      },
    ]),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
