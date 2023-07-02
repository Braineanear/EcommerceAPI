import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Types } from 'mongoose';

import { ITokenDocument } from '@modules/token/interfaces/token.interface';
import { TokenRepository } from '@modules/token/repositories/token.repository';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { UserRepository } from '@modules/user/repositories/user.repository';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { TokenTypes } from '@shared/enums/token-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';
import { MailService } from '@shared/services/mail.service';

import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenDto } from './dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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
    user: IUserDocument,
    expires: moment.Moment,
    type: TokenTypes,
    secret: string,
  ): string {
    const userData = JSON.parse(JSON.stringify(user));
    const payload = {
      sub: {
        ...userData,
        password: undefined,
      },
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
      user,
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
      user,
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

  private async verifyToken(token: string, type: string) {
    const refreshTokenSecret = this.configService.get<string>(
      'auth.jwt.refreshToken.secretKey',
    );
    const accessTokenSecret = this.configService.get<string>(
      'auth.jwt.accessToken.secretKey',
    );
    let payload: string = '';

    if (type === TokenTypes.REFRESH) {
      payload = jwt.verify(token, refreshTokenSecret) as string;
    } else if (type === TokenTypes.ACCESS) {
      payload = jwt.verify(token, accessTokenSecret) as string;
    }

    const tokenDoc = await this.tokenRepository.findOne({
      token,
      type,
      user: payload.sub,
    });

    if (!tokenDoc) {
      this.debuggerService.error(
        `Token ${token} not found`,
        'AuthService',
        'verifyToken',
      );

      throw new HttpException(
        `Token ${token} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return tokenDoc;
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
      user,
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
      isDeleted: false,
    });

    if (!user) {
      this.debuggerService.error(
        `User with email ${email} not found`,
        'AuthService',
        'login',
      );

      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.verifyPassword(plainTextPassword, user.password);

    user.password = undefined;

    return user;
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
      user,
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

  public async sendVerificationEmail(payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.sub);

    if (user.isEmailVerified) {
      this.debuggerService.error(
        `User with email ${user.email} already verified`,
        'AuthService',
        'sendVerificationEmail',
      );

      throw new HttpException(
        `User with email ${user.email} already verified`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const verifyEmailToken = await this.generateVerifyEmailToken(user);

    await this.mailService.sendVerifyEmail(user.email, verifyEmailToken);

    return {
      token: verifyEmailToken,
      message: 'Verification email sent',
    };
  }

  public async verifyEmail(token: string) {
    const tokenDoc = await this.verifyToken(token, TokenTypes.VERIFY_EMAIL);
    const user = await this.userRepository.findById(tokenDoc.user._id);

    user.isEmailVerified = true;

    await user.save();

    await tokenDoc.deleteOne();

    return {
      message: 'Email verified',
    };
  }

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    token: string,
  ) {
    const { password, passwordConfirmation } = resetPasswordDto;

    if (password !== passwordConfirmation) {
      this.debuggerService.error(
        `Passwords do not match`,
        'AuthService',
        'resetPassword',
      );

      throw new HttpException(`Passwords do not match`, HttpStatus.BAD_REQUEST);
    }

    const tokenDoc = await this.verifyToken(token, TokenTypes.RESET_PASSWORD);
    const user = await this.userRepository.findById(tokenDoc.user._id);

    user.password = password;

    await user.save();

    await this.mailService.sendAfterResetPasswordEmail(user.email);

    await this.tokenRepository.deleteOne({
      token,
      type: TokenTypes.RESET_PASSWORD,
    });

    return {
      message: 'Password has been reset',
    };
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

    await this.mailService.sendResetPasswordEmail(
      user.email,
      resetPasswordToken,
    );

    return {
      token: resetPasswordToken,
    };
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

  public async generateTokens(tokenDto: TokenDto) {
    const token = await this.verifyToken(
      tokenDto.refreshToken,
      TokenTypes.REFRESH,
    );

    const user = await this.userRepository.findOne({
      id: token.user,
    });

    if (!user) {
      this.debuggerService.error(
        `User with id ${token.user} not found`,
        'AuthService',
        'generateTokens',
      );

      throw new HttpException(
        `User with id ${token.user} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.refreshTokenExistance(user);

    const tokens = await this.generateAuthTokens(user);

    return tokens;
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
