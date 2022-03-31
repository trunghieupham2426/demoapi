import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { TaskService } from './task.service';

@Module({
  imports: [MailModule],
  providers: [TaskService],
})
export class TaskModule {}
