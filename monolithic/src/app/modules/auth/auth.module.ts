import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TokenModule } from '@modules/token/token.module';
import { UserModule } from '@modules/user/user.module';

import { MailService } from '@shared/services/mail.service';
import { JwtStrategy } from '@shared/strategies/jwt-strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TokenModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt.accessToken.secretKey'),
        signOptions: {
          expiresIn: config.get<string>('auth.jwt.accessToken.expirationTime'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule
  ],
  providers: [AuthService, JwtStrategy, MailService],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, JwtModule],
})
export class AuthModule {}
