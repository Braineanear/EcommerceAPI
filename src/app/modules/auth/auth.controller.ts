import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiQuery, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenDto } from './dtos/token.dto';

@ApiTags('auth')
@Roles(RoleTypeEnum.All)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({summary: 'Log in an existing user'})
  @ApiBody({type: LoginDto})
  @ApiOkResponse({description: 'Logged in successfully'})
  @ApiUnauthorizedResponse({description: 'Invalid credentials'})
  @ApiBadRequestResponse({description: 'Input validation failed'})
  @AllowAnonymous()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({summary: 'Register a new user'})
  @ApiBody({type: RegisterDto})
  @ApiCreatedResponse({description: 'User registered successfully'})
  @ApiBadRequestResponse({description: 'Input validation failed'})
  @AllowAnonymous()
  async register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('logout')
  @ApiOperation({summary: 'Log out an existing user'})
  @ApiBody({type: LogoutDto})
  @ApiOkResponse({description: 'Logged out successfully'})
  @ApiUnauthorizedResponse({description: 'Invalid token'})
  @ApiBadRequestResponse({description: 'Input validation failed'})
  @ApiBearerAuth()
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @Post('generate/tokens')
  @ApiOperation({summary: 'Generate new authentication tokens'})
  @ApiBody({type: TokenDto})
  @ApiOkResponse({description: 'Tokens generated successfully'})
  @ApiUnauthorizedResponse({description: 'Invalid token'})
  @ApiBadRequestResponse({description: 'Input validation failed'})
  @ApiBearerAuth()
  async generateTokens(@Body() tokenDto: TokenDto) {
    return this.authService.generateTokens(tokenDto);
  }

  @Post('forgot-password')
  @ApiOperation({summary: 'Request password reset for a user'})
  @ApiBody({type: ForgotPasswordDto})
  @ApiOkResponse({description: 'Password reset email sent successfully'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiBadRequestResponse({description: 'Input validation failed'})
  @AllowAnonymous()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({summary: 'Reset the password for a user'})
  @ApiBody({type: ResetPasswordDto})
  @ApiQuery({name: 'token', type: String})
  @ApiOkResponse({description: 'Password reset successfully'})
  @ApiBadRequestResponse({description: 'Invalid or expired token'})
  @AllowAnonymous()
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, token);
  }

  @Get('verify-email')
  @ApiOperation({summary: 'Verify the email address of a user'})
  @ApiQuery({name: 'token', type: String})
  @ApiOkResponse({description: 'Email verified successfully'})
  @ApiBadRequestResponse({description: 'Invalid or expired token'})
  @AllowAnonymous()
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('send-verification-email')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Send a verification email to the logged in user'})
  @ApiOkResponse({description: 'Verification email sent successfully'})
  @ApiUnauthorizedResponse({description: 'Unauthorized access'})
  @ApiForbiddenResponse({description: 'Access to the resource is forbidden'})
  async sendVerificationEmail(@AuthUser() user: JwtPayload) {
    return this.authService.sendVerificationEmail(user);
  }

}
