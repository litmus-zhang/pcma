import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get_user.decorator';
import { JwtGuard } from 'src/auth/guards';
import { UserRegisterDto } from 'src/auth/dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('profile')
  async updateMe(@GetUser('id') userId: number, @Body() dto: UserRegisterDto) {
    return this.userService.editMe(userId, dto);
  }
}
