import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';
import { ResponseStatus } from 'src/types/response.status';
import { UserBasicPiiDto, UserSensitivePiiDto, UserUpdateDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User/Individual')
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
  })
  async getMe(@GetUser() user: User): Promise<ResponseStatus> {
    return {
      message: 'User profile fetched successfully',
      data: user,
      status: 200,
    };
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update user profile',
  })
  async updateMe(@GetUser('id') userId: number, @Body() dto: UserUpdateDto) {
    return this.userService.editMe(userId, dto);
  }

  @Post('basic-pii')
  @ApiOperation({
    summary: 'Set basic PII',
  })
  async setBasicPII(
    @GetUser('id') userId: number,
    @Body() dto: UserBasicPiiDto,
  ) {
    return this.userService.setBasicPII(userId, dto);
  }

  @Post('sensitive-pii')
  @ApiOperation({
    summary: 'Set sensitive/Personal PII',
  })
  async setSensitivePII(
    @GetUser('id') userId: number,
    @Body() dto: UserSensitivePiiDto,
  ) {
    return this.userService.setSensitivePII(userId, dto);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get user dashboard data',
  })
  async getDashboard(@GetUser('id') userId: number) {
    return this.userService.getDashboard(userId);
  }
  @Get('all-data-leaks')
  @ApiOperation({
    summary: 'Get all data leaks',
  })
  async getAllDataLeaks(@GetUser('id') userId: number) {
    return this.userService.getAllDataLeaks(userId);
  }
}
