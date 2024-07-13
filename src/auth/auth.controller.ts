import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterDto, CompanyRegisterDto, UserLoginDto } from './dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/signup')
  @ApiOperation({
    summary: 'User Signup',
    description: 'This endpoint is used for user signup.',
  })
  async userSignup(@Body() dto: UserRegisterDto) {
    return this.authService.userSignup(dto);
  }

  @Post('user/login')
  @ApiOperation({
    summary: 'User login',
  })
  async userLogin(@Body() dto: UserLoginDto) {
    return this.authService.userLogin(dto);
  }

  @Post('tp/signup')
  @ApiOperation({
    summary: 'Transaction party/service provider  signup',
  })
  async transactionPartySignup(@Body() dto: CompanyRegisterDto) {
    return this.authService.tpSignup(dto);
  }
  @Post('tp/login')
  @ApiOperation({
    summary: 'Transaction party/service provider login',
  })
  async transactionPartyLogin(@Body() dto: UserLoginDto) {
    return this.authService.tpLogin(dto);
  }
}
