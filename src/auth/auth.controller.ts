import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterDto, CompanyRegisterDto, UserLoginDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/signup')
  async userSignup(@Body() dto: UserRegisterDto) {
    return this.authService.userSignup(dto);
  }

  @Post('user/login')
  async userLogin(@Body() dto: UserLoginDto) {
    return this.authService.userLogin(dto);
  }

  @Post('tp/signup')
  async transactionPartySignup(@Body() dto: CompanyRegisterDto) {
    return this.authService.tpSignup(dto);
  }
  @Post('tp/login')
  async transactionPartyLogin(@Body() dto: UserLoginDto) {
    return this.authService.tpLogin(dto);
  }
}
