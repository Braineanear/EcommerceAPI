import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenDocument } from '@modules/token/models/token.entity';
import { TokenRepository } from '@modules/token/repositories/token.repository';
import { UserDocument } from '@modules/user/models/user.entity';
import { UserRepository } from '@modules/user/repositories/user.repository';

import { DebuggerService } from '@shared/debugger/debugger.service';
import { TokenTypes } from '@shared/enums/token-type.enum';
import { MessagesMapping } from '@shared/messages-mapping';
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

  private async refreshTokenExistance(user: UserDocument): Promise<void> {
    await this.tokenRepository.deleteOne({
      user: user.id,
      type: TokenTypes.REFRESH,
    });
  }

  private async userExistance(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (user) {
      throw new HttpException(MessagesMapping['#1'], HttpStatus.BAD_REQUEST);
    }
  }

  private generateToken(
    user: UserDocument,
    expires: moment.Moment,
    type: TokenTypes,
    secret: string,
  ): string {
    const payload = {
      sub: { ...user.toObject(), password: undefined },
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
  ): Promise<TokenDocument> {
    return this.tokenRepository.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
    });
  }

  private async generateAuthTokens(user: UserDocument) {
    const accessTokenExpires = moment().add(
      this.configService.get<number>('auth.jwt.accessToken.expirationTime'),
      'minutes',
    );
    const accessTokenSecret = this.configService.get<string>('auth.jwt.accessToken.secretKey');

    const accessToken = this.generateToken(
      user,
      accessTokenExpires,
      TokenTypes.ACCESS,
      accessTokenSecret,
    );

    const refreshTokenExpires = moment().add(
      this.configService.get<number>('auth.jwt.refreshToken.expirationTime'),
      'days',
    );
    const refreshTokenSecret = this.configService.get<string>('auth.jwt.refreshToken.secretKey');

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

  private async verifyToken(token: string, type: TokenTypes) {
    const secret = this.configService.get<string>(
      type === TokenTypes.REFRESH ? 'auth.jwt.refreshToken.secretKey' : 'auth.jwt.accessToken.secretKey'
    );

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      throw new HttpException(MessagesMapping['#2'], HttpStatus.UNAUTHORIZED);
    }

    const tokenDoc = await this.tokenRepository.findOne({
      token,
      type,
      user: payload.sub._id,
    });

    if (!tokenDoc) {
      throw new HttpException(MessagesMapping['#2'], HttpStatus.NOT_FOUND);
    }

    return tokenDoc;
  }

  private async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new HttpException(MessagesMapping['#1'], HttpStatus.BAD_REQUEST);
    }

    const expires = moment().add(
      this.configService.get<number>('auth.jwt.forgotPasswordToken.expirationTime'),
      'hours',
    );
    const secret = this.configService.get<string>('auth.jwt.forgotPasswordToken.secretKey');

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
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);

    if (!isPasswordMatching) {
      throw new HttpException(MessagesMapping['#3'], HttpStatus.UNAUTHORIZED);
    }
  }

  private async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ email, isDeleted: false });

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    await this.verifyPassword(plainTextPassword, user.password);

    user.password = undefined;

    return user;
  }

  private async generateVerifyEmailToken(user: UserDocument): Promise<string> {
    const expires = moment().add(
      this.configService.get<number>('auth.jwt.verifyEmailToken.expirationTime'),
      'hours',
    );
    const secret = this.configService.get<string>('auth.jwt.verifyEmailToken.secretKey');

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

  public async sendVerificationEmail(payload: any) {
    const user = await this.userRepository.findById(payload);

    if (user.isEmailVerified) {
      throw new HttpException(MessagesMapping['#4'], HttpStatus.BAD_REQUEST);
    }

    const verifyEmailToken = await this.generateVerifyEmailToken(user);

    await this.mailService.sendVerifyEmail(user.email, verifyEmailToken);

    return {
      token: verifyEmailToken,
      message: MessagesMapping['#5'],
    };
  }

  public async verifyEmail(token: string) {
    const tokenDoc = await this.verifyToken(token, TokenTypes.VERIFY_EMAIL);
    const user = await this.userRepository.findById(tokenDoc.user._id);

    user.isEmailVerified = true;

    await user.save();
    await tokenDoc.deleteOne();

    return {
      message: MessagesMapping['#6'],
    };
  }

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    token: string,
  ) {
    const { password, passwordConfirmation } = resetPasswordDto;

    if (password !== passwordConfirmation) {
      throw new HttpException(MessagesMapping['#7'], HttpStatus.UNAUTHORIZED);
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
      message: MessagesMapping['#8'],
    };
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const user = await this.userRepository.findOne({ email: forgotPasswordDto.email });

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    const resetPasswordToken = await this.generateResetPasswordToken(forgotPasswordDto.email);

    await this.mailService.sendResetPasswordEmail(user.email, resetPasswordToken);

    return { token: resetPasswordToken };
  }

  public async login(loginDto: LoginDto) {
    const user = await this.getAuthenticatedUser(loginDto.email, loginDto.password);

    await this.refreshTokenExistance(user);

    const tokens = await this.generateAuthTokens(user);

    return {
      type: 'success',
      statusCode: 200,
      message: MessagesMapping['#10'],
      user,
      tokens,
    };
  }

  public async generateTokens(tokenDto: TokenDto) {
    const token = await this.verifyToken(tokenDto.refreshToken, TokenTypes.REFRESH);
    const user = await this.userRepository.findById(token.user._id);

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
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
      throw new HttpException(MessagesMapping['#11'], HttpStatus.NOT_FOUND);
    }

    await this.tokenRepository.deleteOne({
      token: logoutDto.refreshToken,
      type: TokenTypes.REFRESH,
    });

    return {
      type: 'success',
      statusCode: 200,
      message: MessagesMapping['#12'],
    };
  }

  public async register(registrationData: RegisterDto) {
    await this.userExistance(registrationData.email);

    const createdUser = await this.userRepository.create({ ...registrationData });

    createdUser.password = undefined;

    const tokens = await this.generateAuthTokens(createdUser);

    return {
      type: 'success',
      statusCode: 200,
      message: MessagesMapping['#13'],
      user: createdUser,
      tokens,
    };
  }
}
