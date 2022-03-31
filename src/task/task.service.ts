import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { reminderTask } from './rawquery/rawquery';
import { getManager } from 'typeorm';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TaskService {
  constructor(private mailService: MailService) {}
  @Cron('0 0 * * *') // run at 0h00 every day
  async handleCron() {
    const entityManager = getManager();
    const result = await entityManager.query(reminderTask);
    //group email have same class together
    const groupEmail = Object.values(
      result.reduce((prev, cur) => {
        prev[cur.id] = prev[cur.id] || { ...cur, email: [] };
        prev[cur.id].email.push(cur.email);
        return prev;
      }, {}),
    );
    //send email to user by group email
    groupEmail.forEach(async (el) => {
      await this.mailService.sendClassReminder(
        //@ts-ignore
        el.email,
        //@ts-ignore
        el.subject,
        //@ts-ignore
        el.startDate,
      );
    });
  }
}
