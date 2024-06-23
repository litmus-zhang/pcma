import { Novu } from '@novu/node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private readonly novu: Novu;

  constructor(private config: ConfigService) {
    this.novu = new Novu(process.env.NOVU_API_KEY);
  }
  async sendNotification(triggerId: string, data: any) {
    try {
      await this.novu.trigger(triggerId, data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async sendEmailNotification(to: string, subject: string, content: string) {
    const emailData = {
      to,
      subject,
      content,
    };
    await this.sendNotification(
      this.config.get('EMAIL_WORKFLOW_IF'),
      emailData,
    );
  }
}
