import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Headers,
  Get,
  Param,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../blogs/entities/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req, @Response() res) {
    return this.authService.googleSignUp(req, res);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req) {}

  @Get('facebook-redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Request() req, @Response() res) {
    return this.authService.facebookSignUp(req, res);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Headers('authorization') authHeader: string) {
    return await this.authService.logout(authHeader);
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Request() req) {
    return this.authService.resetPassword(resetPasswordDto, req);
  }

  @Get('validate-reset-token/:token')
  validateResetToken(@Param('token') token: string) {
    return this.authService.validateResetToken(token);
  }
}
