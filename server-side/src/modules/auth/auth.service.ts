import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    console.log(user);
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
      access_token: this.jwtService.sign(payload),
    };
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
      role: savedUser.role,
    };
  }
}
