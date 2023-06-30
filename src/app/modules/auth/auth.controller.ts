import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@shared/guards/auth.guard';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenDto } from './dtos/token.dto';
import { EmailVerificationDto } from './dtos/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @ApiBearerAuth()
  @Post('generate/tokens')
  async generateTokens(@Body() tokenDto: TokenDto) {
    return this.authService.generateTokens(tokenDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Query('token') token: string) {
    return this.authService.resetPassword(resetPasswordDto, token);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('send-verification-email')
  @UseGuards(JwtAuthGuard)
  async sendVerificationEmail(@AuthUser() user: JwtPayload) {
    return this.authService.sendVerificationEmail(user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async signInWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async signInWithGoogleRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }
}
