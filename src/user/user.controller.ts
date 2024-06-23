import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';
import { UserRegisterDto } from '../auth/dto';
import { ResponseStatus } from 'src/types/response.status';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getMe(@GetUser() user: User): Promise<ResponseStatus> {
    return {
      message: 'User profile fetched successfully',
      data: user,
      status: 200,
    };
  }

  @Patch('profile')
  async updateMe(@GetUser('id') userId: number, @Body() dto: UserRegisterDto) {
    return this.userService.editMe(userId, dto);
  }
}
