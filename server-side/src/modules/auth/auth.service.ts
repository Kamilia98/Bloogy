import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { MailService } from '../../services/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  private blacklistedTokens: Set<string> = new Set();

  async login(loginDto: LoginDto, res) {
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: 'Login successful',
    });
  }

  async googleSignUp(req, res) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }
    const { email, firstName, lastName, picture } = req.user;

    let user: UserDocument | null = await this.userModel
      .findOne({ email })
      .select('name email avatar');

    if (!user) {
      user = new this.userModel({
        email,
        name: `${firstName} ${lastName}`,
        avatar: picture,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 12),
      });
      user = await user.save();
    }

    const payload = { sub: user._id, email: user.email };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,
    });

    res.redirect(
      `${this.configService.get<string>('FRONTEND_URL')}/auth/login/callback`,
    );
  }

  async facebookSignUp(req, res) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Facebook');
    }

    const { email, name } = req.user;

    let user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      user = new this.userModel({
        email,
        name,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 12),
      });
      await user.save();
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,
    });

    res.redirect(
      `${this.configService.get<string>('FRONTEND_URL')}/auth/login/callback`,
    );
  }

  async logout(req, res) {
    const token = req.cookies?.jwt;
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    this.blacklistedTokens.add(token);

    // Clear the cookie from the browser
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    return {
      _id: savedUser._id,
      email: savedUser.email,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgetPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const token = this.jwtService.sign(
      { email: user.email },
      {
        secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
        expiresIn: '15m', // Token expires in 15 minutes
      },
    );

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://i.ibb.co/XfxtCdVz/logo.png" alt="Bloogy Logo" style="height: 50px;" />
        </div>
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Hello ${user.name || ''},<br><br>
          We received a request to reset your password. Click the button below to set a new one:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.configService.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}"
            style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #fff; background-color: #4364F7; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #999; line-height: 1.4;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; color: #999; line-height: 1.4;">
          This link will expire in 15 minutes for security reasons.
        </p>
      </div>
    `;

    try {
      await this.mailService.sendMail(user.email, 'Password Reset', '', html);
    } catch (error) {
      throw new BadRequestException('Failed to send email');
    }

    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    let decoded;
    try {
      decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userModel.findOne({ email: decoded.email });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 12);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    return { message: 'Password has been reset successfully' };
  }

  async validateResetToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
