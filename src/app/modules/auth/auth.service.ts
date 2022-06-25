import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { TokenTypes } from '@shared/enums/token-type.enum';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { TokenRepository } from '@modules/token/repositories/token.repository';
import { ITokenDocument } from '@modules/token/interfaces/token.interface';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
  ) {}

  private async refreshTokenExistance(user: IUserDocument): Promise<void> {
    await this.tokenRepository.deleteOne({
      user: user.id,
      type: TokenTypes.REFRESH,
    });
  }

  private async userExistance(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      email,
    });

    if (user) {
      this.debuggerService.error(
        `User with email ${email} already exists`,
        'AuthService',
        'register',
      );

      throw new HttpException(
        `User with email ${email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private generateToken(
    userId: string,
    expires: moment.Moment,
    type: TokenTypes,
    secret: string,
  ): string {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };

    return jwt.sign(payload, secret);
  }

  private async saveToken(
    token: string,
    userId: Types.ObjectId,
    expires: moment.Moment,
    type: TokenTypes,
  ): Promise<ITokenDocument> {
    const tokenDoc = await this.tokenRepository.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
    });

    return tokenDoc;
  }

  private async generateAuthTokens(user: IUserDocument) {
    const accessTokenExpires = moment().add(
      this.configService.get('auth.jwt.accessToken.expirationTime'),
      'minutes',
    );
    const accessTokenSecret = this.configService.get<string>(
      'auth.jwt.accessToken.secretKey',
    );

    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      TokenTypes.ACCESS,
      accessTokenSecret,
    );

    const refreshTokenExpires = moment().add(
      this.configService.get('auth.jwt.refreshToken.expirationTime'),
      'days',
    );
    const refreshTokenSecret = this.configService.get<string>(
      'auth.jwt.refreshToken.secretKey',
    );

    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      TokenTypes.REFRESH,
      refreshTokenSecret,
    );

    await this.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      TokenTypes.REFRESH,
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
    };
  }

  private async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      this.debuggerService.error(
        `User with email ${email} not found`,
        'AuthService',
        'generateResetPasswordToken',
      );

      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const expires = moment().add(
      this.configService.get('auth.jwt.forgotPasswordToken.expirationTime'),
      'hours',
    );
    const secret = this.configService.get<string>(
      'auth.jwt.forgotPasswordToken.secretKey',
    );

    const resetPasswordToken = this.generateToken(
      user.id,
      expires,
      TokenTypes.RESET_PASSWORD,
      secret,
    );

    await this.saveToken(
      resetPasswordToken,
      user.id,
      expires,
      TokenTypes.RESET_PASSWORD,
    );

    return resetPasswordToken;
  }

  private async generateVerifyEmailToken(user: IUserDocument): Promise<string> {
    const expires = moment().add(
      this.configService.get('auth.jwt.verifyEmailToken.expirationTime'),
      'hours',
    );
    const secret = this.configService.get<string>(
      'auth.jwt.verifyEmailToken.secretKey',
    );

    const verifyEmailToken = this.generateToken(
      user.id,
      expires,
      TokenTypes.VERIFY_EMAIL,
      secret,
    );

    await this.saveToken(
      verifyEmailToken,
      user.id,
      expires,
      TokenTypes.VERIFY_EMAIL,
    );

    return verifyEmailToken;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      this.debuggerService.error(
        `Wrong credentials provided`,
        'AuthService',
        'verifyPassword',
      );

      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<IUserDocument> {
    const user = await this.userRepository.findOne({
      email,
    });

    await this.verifyPassword(plainTextPassword, user.password);

    user.password = undefined;

    return user;
  }

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      email: forgotPasswordDto.email,
    });

    if (!user) {
      this.debuggerService.error(
        `User with email ${forgotPasswordDto.email} not found`,
        'AuthService',
        'forgotPassword',
      );

      throw new HttpException(
        `User with email ${forgotPasswordDto.email} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const resetPasswordToken = await this.generateResetPasswordToken(
      forgotPasswordDto.email,
    );

    return resetPasswordToken;
    // this.sendMailForgotPassword(userUpdate.email, passwordRand);
  }

  public async login(loginDto: LoginDto) {
    const user = await this.getAuthenticatedUser(
      loginDto.email,
      loginDto.password,
    );

    await this.refreshTokenExistance(user);

    const tokens = await this.generateAuthTokens(user);

    return {
      type: 'Success',
      statusCode: 200,
      message: 'loginSuccess',
      user,
      tokens,
    };
  }

  public async logout(logoutDto: LogoutDto) {
    const refreshToken = await this.tokenRepository.findOne({
      token: logoutDto.refreshToken,
      type: TokenTypes.REFRESH,
    });

    if (!refreshToken) {
      this.debuggerService.error(
        `Refresh token not found`,
        'AuthService',
        'logout',
      );

      throw new HttpException(
        `Refresh token not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.tokenRepository.deleteOne({
      token: logoutDto.refreshToken,
      type: TokenTypes.REFRESH,
    });

    return {
      type: 'Success',
      statusCode: 200,
      message: 'logoutSuccess',
    };
  }

  public async validateUserByJwt(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      email: payload.email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.generateAuthTokens(user);
  }

  public async register(registrationData: RegisterDto) {
    await this.userExistance(registrationData.email);

    const createdUser = await this.userRepository.create({
      ...registrationData,
    });

    createdUser.password = undefined;

    const tokens = await this.generateAuthTokens(createdUser);

    return {
      type: 'success',
      statusCode: 200,
      message: 'registerSuccess',
      user: createdUser,
      tokens,
    };
  }

  public async signInWithGoogle(data) {
    if (!data.user) throw new BadRequestException();

    let user = (
      await this.userRepository.findOne({ googleId: data.user.id })
    )[0];

    if (user) return this.login(user);

    user = (await this.userRepository.findOne({ email: data.user.email }))[0];

    if (user)
      throw new ForbiddenException(
        "User already exists, but Google account was not connected to user's account",
      );

    const newUser = await this.userRepository.create({
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      email: data.user.email,
      googleId: data.user.id,
    });

    return this.login(newUser);
  }
}
