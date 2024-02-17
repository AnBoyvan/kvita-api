import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from 'src/modules/auth/auth.service';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      expiresIn: '10d',
    });
  }

  async validate(payload: { id: string }): Promise<UserDocument> {
    const id = new Types.ObjectId(payload.id);
    const user = await this.authService.current(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user?.accessToken) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
