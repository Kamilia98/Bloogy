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
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() loginDto: LoginDto, @Response() res) {
    return this.authService.login(loginDto, res);
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
  facebookAuthRedirect(@Request() req: Request, @Response() res: Response) {
    return this.authService.facebookSignUp(req, res);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req, @Res() res) {
    return await this.authService.logout(req, res);
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Request() req) {
    console.log(resetPasswordDto);
    return this.authService.resetPassword(resetPasswordDto, req);
  }

  @Get('validate-reset-token/:token')
  validateResetToken(@Param('token') token: string) {
    return this.authService.validateResetToken(token);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    const user = req.user;
    return this.usersService.findOne(user.userId);
  }
}
