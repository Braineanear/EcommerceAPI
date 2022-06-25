import { Logger, Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { DebuggerModule } from '@shared/debugger/debugger.module';
import { JwtAuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import Configs from '@shared/config';
import { LoggerMiddleware } from '@shared/middlewares/http-logger.middleware';
import { ImageModule } from '@modules/image/image.module';
import { JwtStrategy } from '@shared/strategies/jwt-startegy';
import { MongoDriverErrorFilter } from '@shared/filters/mongo-driver-error.filter';
import { MongooseErrorFilter } from '@shared/filters/mongoose-error.filter';
import { LoggerModule } from '@shared/logger/logger.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    WinstonModule.forRootAsync({
      imports: [DebuggerModule],
      useFactory: (logger: winston.LoggerOptions) => {
        return {
          transports: [
            new winston.transports.Console({
              level: logger.level,
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(),
                nestWinstonModuleUtilities.format.nestLike(),
              ),
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('DATABASE_URL'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          connectionFactory: (connection) => {
            connection.plugin(require('mongoose-paginate-v2'));
            connection.plugin(require('mongoose-autopopulate'));
            Logger.debug(
              `App connected to mongodb on ${config.get<string>(
                'DATABASE_URL',
              )}`,
              'MONGODB',
            );
            return connection;
          },
        };
      },
    }),
    AuthModule,
    UserModule,
    ImageModule,
    LoggerModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: MongoDriverErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongooseErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
