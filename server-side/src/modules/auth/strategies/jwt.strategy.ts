import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { UserRole } from '../../../enums/userRole.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const secretOrKey = configService.get<string>('JWT_SECRET');
    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);
    return {
      userId: payload.sub,
      email: payload.email,
      role: user?.role || UserRole.USER,
    };
  }
}
