import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    const clientID = process.env.FACEBOOK_APP_ID;
    const clientSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientID || !clientSecret || !redirectUri) {
      throw new Error(
        'Missing Facebook App ID or Secret in environment variables',
      );
    }
    super({
      clientID,
      clientSecret,
      callbackURL: redirectUri,
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
      email: emails && emails.length > 0 ? emails[0].value : null,
      firstName: name && name.givenName ? name.givenName : null,
      lastName: name && name.familyName ? name.familyName : null,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
