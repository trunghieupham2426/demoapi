import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): any => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '180m' },
        };
      },
    }),
    CloudinaryModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService, PassportModule, JwtModule], // de cac module khac khi import user module co the su dung jwt va passport
})
export class UserModule {}
