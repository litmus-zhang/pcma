import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @Post('send-email')
  // async sendEmailNotification(to: string, subject: string, content: string) {
  //   return this.notificationService.sendEmailNotification(to, subject, content);
  // }
}
