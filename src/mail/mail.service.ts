import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    const url = `http:127.0.0.1:3000/user/verify/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Madison! Confirm your Email',
      html: `<a href=${url} target="_blank">Click Here To Verify Email</a>`,
    });
  }

  async sendClassReminder(email: string, subject: string, date: Date) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reminder...',
      text: `Your ${subject} class will start on ${date}`,
    });
  }

  async sendRegistrationLetter(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Registration letter',
      text: 'Thank you for registered this class , please wait for admin approve',
    });
  }

  async sendSubmitRegistration(email: string, action: string, course: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'About your registration',
      text: `You registered for ${course} class have been ${action} by admin`,
    });
  }
}
