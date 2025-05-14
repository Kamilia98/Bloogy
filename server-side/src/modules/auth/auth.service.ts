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
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
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
      user: user,
    };
  }

  // Add this array to temporarily store invalidated tokens
  private blacklistedTokens: string[] = [];

  async logout(token: string) {
    // Optional: validate token before blacklisting
    try {
      console.log('token', token);
      const decoded = this.jwtService.verify(token);
      console.log('decoded', decoded);
      this.blacklistedTokens.push(token);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Utility method (optional): check if a token is blacklisted
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
}
