import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClassModule } from './class/class.module';
import { RegistrationModule } from './registration/registration.module';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    ClassModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    RegistrationModule,
    TaskModule,
    MailModule,
  ],
  providers: [TaskService],
})
export class AppModule {}
