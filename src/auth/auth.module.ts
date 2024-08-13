import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, NotificationService],
})
export class AuthModule {}
