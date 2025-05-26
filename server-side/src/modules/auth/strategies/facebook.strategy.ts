import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('FACEBOOK_APP_ID');
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_REDIRECT_URI');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Missing Facebook App ID, Secret, or Redirect URI in config',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails?.[0]?.value ?? null,
      firstName: name?.givenName ?? null,
      lastName: name?.familyName ?? null,
    };

    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
