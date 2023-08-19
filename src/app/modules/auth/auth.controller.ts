import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenDto } from './dtos/token.dto';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Roles(RoleTypeEnum.All)
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Route: POST: /auth/login
  @Post('login')
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Logged in successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  // Controller
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Route: POST: /auth/register
  @Post('register')
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  // Controller
  async register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  // Route: POST: /auth/logout
  @Post('logout')
  // Swagger
  @ApiOperation({ summary: 'Log out an existing user' })
  @ApiBody({ type: LogoutDto })
  @ApiOkResponse({ description: 'Logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  // Controller
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  // Route: GET: /generate/tokens
  @Post('generate/tokens')
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Generate new authentication tokens' })
  @ApiBody({ type: TokenDto })
  @ApiOkResponse({ description: 'Tokens generated successfully' })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  // Controller
  async generateTokens(@Body() tokenDto: TokenDto) {
    return this.authService.generateTokens(tokenDto);
  }

  // Route: GET: /auth/forgot-password
  @Post('forgot-password')
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Request password reset for a user' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: 'Password reset email sent successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  // Controller
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // Route: GET: /auth/reset-password
  @Post('reset-password')
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Reset the password for a user' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiQuery({ name: 'token', type: String })
  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  // Controller
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, token);
  }

  // Route: GET: /auth/verify-email
  @Get('verify-email')
  // Decorator to allow anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOperation({ summary: 'Verify the email address of a user' })
  @ApiQuery({ name: 'token', type: String })
  @ApiOkResponse({ description: 'Email verified successfully' })
  @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  // Controller
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // Route: POST: /auth/send-verification-email
  @Post('send-verification-email')
  // Swagger
  @ApiOperation({ summary: 'Send a verification email to the logged in user' })
  @ApiOkResponse({ description: 'Verification email sent successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiForbiddenResponse({ description: 'Access to the resource is forbidden' })
  // Controller
  async sendVerificationEmail(@AuthUser() user: any) {
    return this.authService.sendVerificationEmail(user);
  }
}
