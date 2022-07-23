import { IUserDocument } from '@modules/user/interfaces/user.interface';
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtAuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
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
  public async register(
    @Res() res,
    @Body() registerUserDto: RegisterDto,
  ): Promise<any> {
    await this.authService.register(registerUserDto);

    return res.status(HttpStatus.OK).json({
      message: 'User registration successfully!',
      status: 200,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  public async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @ApiBearerAuth()
  @Post('generate/tokens')
  public async generateTokens(@Body() tokenDto: TokenDto) {
    return this.authService.generateTokens(tokenDto);
  }

  @Post('forgot-password')
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-email')
  public async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.authService.verifyEmail(emailVerificationDto);
  }

  @Post('send-verification-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  public async sendVerificationEmail(@AuthUser() user: JwtPayload) {
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
