import { Novu } from '@novu/node';
import { BadRequestException, Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Resend } from 'resend';

@Global()
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
      // const resend = new Resend(this.config.get('RESEND_API_KEY'));
      // const { data, error } = await resend.emails.send({
      //   from: 'John Doe <joe@pcma.com>',
      //   to: to,
      //   subject: subject,
      //   html: content,
      // });

      // if (error) {
      //   return console.error({ error });
      // }
      console.log({
        subject,
        to,
        content,
      });

      return {
        message: 'Email sent successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
