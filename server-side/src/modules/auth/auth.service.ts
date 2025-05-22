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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
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
    return {
      token: this.jwtService.sign(payload),
      user: { _id: user._id, name: user.name, email: user.email },
    };
  }

  async googleSignUp(req, res) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }
    const { email, firstName, lastName, picture } = req.user;

    let user: UserDocument | null = await this.userModel
      .findOne({ email })
      .select('name email avatar');

    if (!user) {
      user = new this.userModel({
        email,
        name: firstName + ' ' + lastName,
        avatar: picture,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
      user = await this.userModel
        .findOne({ email })
        .select('name email avatar');
    }

    if (!user) {
      throw new UnauthorizedException('User not found after creation');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token);
    res.cookie('user', JSON.stringify(user));

    res.redirect(`${process.env.FRONTEND_URL}/auth/login`);
  }

  async facebookSignUp(req, res) {
    if (!req.user) {
      throw new UnauthorizedException('No user from facebook');
    }

    const { email, name } = req.user;

    let user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      user = new this.userModel({
        email,
        name,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
      await user.save();
    }
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    res.cookie('jwt', token);
    res.cookie('user', JSON.stringify(user));
    res.redirect(`${process.env.FRONTEND_URL}/auth/login`);
  }

  private blacklistedTokens: string[] = [];

  async logout(authHeader: string) {
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      this.blacklistedTokens.push(token);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.includes(token);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = new this.userModel(registerDto);
    user.password = await bcrypt.hash(user.password, 10);
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

    const token = this.jwtService.sign({ email: user.email });
    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://iili.io/3rVbVdF.png" alt="Bloogy Logo" style="height: 50px;" />
    </div>

    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
    
    <p style="font-size: 16px; color: #555; line-height: 1.5;">
      Hello ${user.name || ''},<br><br>
      We received a request to reset your password. Click the button below to set a new one:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${token}"
        style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #fff; background-color: #4364F7; text-decoration: none; border-radius: 6px;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #999; line-height: 1.4;">
      If you didn't request this, you can safely ignore this email.
    </p>

    <p style="font-size: 14px; color: #999; line-height: 1.4;">
      This link will expire in 1 hour for security reasons.
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
    console.log(req.headers);
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    console.log('Token:', token);
    const decoded = this.jwtService.verify(token);
    const user = await this.userModel.findOne({ email: decoded.email });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const { password } = resetPasswordDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
  }

  async validateResetToken(token: string) {
    const decoded = this.jwtService.verify(token);
    return decoded;
  }
}
