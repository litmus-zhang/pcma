import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { DatabaseService } from '../../database/database.service';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private database: DatabaseService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; email: string }) {
    const user = await this.database.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) return null;
    delete user.password;

    return user;
  }
}
