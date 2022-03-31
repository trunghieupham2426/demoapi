import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Global() // 👈 global module
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): any => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: '465',
            secure: true,
            auth: {
              user: config.get<string>('GMAIL_USERNAME'),
              pass: config.get<string>('GMAIL_PASSWORD'),
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
