import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../database/database.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private readonly database: DatabaseService,
    // Assume `database` is properly injected here for accessing the database
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_JWT_SECRET'),
      passReqToCallback: true, // Enable request object in validate method
    });
  }

  async validate(
    req: Request,
    payload: { sub: number; email: string; role: string },
  ) {
    // check if payload.role is 'user' or 'transaction_party'
    const isUserRequest = payload.role === 'user';
    const isTransactionPartyRequest = payload.role === 'transaction_party';
    if (isTransactionPartyRequest) {
      // Handle transaction party logic
      const transactionParty = await this.database.transactionParty.findUnique({
        where: { id: payload.sub },
      });
      if (transactionParty) {
        delete transactionParty.password;
        return transactionParty;
      }
    } else if (isUserRequest) {
      // Handle user logic
      const user = await this.database.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) return null;
      delete user.password;
      return user;
    }

    // If neither, you might want to handle it differently or return null
    return null;
  }
}
