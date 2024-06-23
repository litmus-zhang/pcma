import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
@Global()
@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
