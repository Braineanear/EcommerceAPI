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
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

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

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async signInWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async signInWithGoogleRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }
}
