import { Novu } from '@novu/node';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailOptions, Resend } from 'resend';

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

  async sendEmailNotificationWithNovu(
    to: string,
    subject: string,
    content: string,
  ) {
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
  async sendEmailNotificationWithResend(
    to: string,
    subject: string,
    content: string,
  ) {
    try {
      const resend = new Resend(this.config.get('RESEND_API_KEY'));
      const emailData: CreateEmailOptions = {
        to,
        subject,
        from: 'joe@pcma.com',
        text: content,
      };
      await resend.emails.send(emailData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
