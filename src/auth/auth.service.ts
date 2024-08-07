import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CompanyRegisterDto,
  RefreshTokenDto,
  UserLoginDto,
  UserRegisterDto,
} from './dto';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { UserRole } from '../types/response.status';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async userSignup(registerDto: UserRegisterDto) {
    const findUser = await this.database.user.findUnique({
      where: { email: registerDto.email },
    });
    if (findUser) {
      throw new BadRequestException('Email already exists');
    }
    const hash = await argon.hash(registerDto.password);
    try {
      await this.database.user.create({
        data: {
          email: registerDto.email,
          firstname: registerDto.firstName,
          lastname: registerDto.lastName,
          password: hash,
        },
      });
      // await this.signToken(user.id, user.email, UserRole.USER);
      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw new BadRequestException('Error occurred while registering user');
    }
  }
  async tpSignup(registerDto: CompanyRegisterDto) {
    const findCompany = await this.database.transactionParty.findFirst({
      where: { email: registerDto.email },
    });
    if (findCompany) {
      throw new BadRequestException('Email already exists');
    }
    const hash = await argon.hash(registerDto.password);
    try {
      await this.database.transactionParty.create({
        data: {
          email: registerDto.email,
          name: registerDto.companyName,
          password: hash,
        },
      });
      // await this.signToken(
      //   company.id,
      //   company.email,
      //   UserRole.TRANSACTION_PARTY,
      // );
      return {
        message: 'Company registered successfully',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw new BadRequestException('Error occurred while registering company');
    }
  }
  async userLogin(dto: UserLoginDto) {
    const user = await this.database.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isValid = await argon.verify(user.password, dto.password);
    if (!isValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = await this.signToken(user.id, user.email, UserRole.USER);

    if (user.firstTimeLogin) {
      user.firstTimeLogin = false;
      await this.database.user.update({
        where: {
          id: user.id,
        },
        data: {
          firstTimeLogin: false,
        },
      });
      return {
        message: 'User login successfully',
        role: UserRole.USER,
        firstTimeLogin: true,
        token,
      };
    }
    return {
      message: 'User login successfully',
      token,
      role: UserRole.USER,
      firstTimeLogin: false,
    };
  }

  async tpLogin(dto: UserLoginDto) {
    const company = await this.database.transactionParty.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (!company) {
      throw new BadRequestException('Invalid email or password');
    }
    const isValid = await argon.verify(company.password, dto.password);
    if (!isValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = await this.signToken(
      company.id,
      company.email,
      UserRole.TRANSACTION_PARTY,
    );
    if (company.firstTimeLogin) {
      company.firstTimeLogin = false;
      await this.database.transactionParty.update({
        where: {
          id: company.id,
        },
        data: {
          firstTimeLogin: false,
        },
      });
      return {
        message: 'Company login successfully',
        role: UserRole.TRANSACTION_PARTY,
        firstTimeLogin: true,
        token,
      };
    }
    return {
      message: 'Company login successfully',
      token,
      role: UserRole.TRANSACTION_PARTY,
      firstTimeLogin: false,
    };
  }

  async signToken(
    userId: number,
    email: string,
    role: UserRole,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: userId, email, role };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('ACCESS_JWT_SECRET'),
    });
    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('REFRESH_JWT_SECRET'),
    });
    return {
      access_token,
      refresh_token,
    };
  }
  async refreshToken(token: RefreshTokenDto) {
    try {
      const { refresh_token } = token;
      const payload = await this.jwt.verifyAsync(String(refresh_token), {
        secret: this.config.get('REFRESH_JWT_SECRET'),
      });
      console.log({ payload });
      return await this.signToken(payload.sub, payload.email, payload.role);
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
