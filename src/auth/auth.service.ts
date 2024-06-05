import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor() {}
  async signup(registerDto: RegisterDto) {
    console.log(registerDto);
    return {
      message: 'User registered successfully',
    };
  }
}
