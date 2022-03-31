import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class]), UserModule],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
