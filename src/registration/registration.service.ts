import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassService } from 'src/class/class.service';
import { UpdateClassDto } from 'src/class/dto/update-class.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/user.entity';
import { In, Repository } from 'typeorm';
import { regisStatus, Registration } from './registration.entity';
import { classStatus } from '../class/class.entity';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration) private repo: Repository<Registration>,
    private classService: ClassService,
    private mailService: MailService,
  ) {}

  async createRegistration(user: User, classId: string) {
    // find class with classId
    const currentClass = await this.classService.findClassById(classId);
    if (currentClass.status !== classStatus.OPEN) {
      throw new BadRequestException('Class not open at this time');
    }

    const currentRegis = await this.repo.findOne({
      where: {
        classId: classId,
        userId: user.id,
        status: In([regisStatus.PENDING, regisStatus.ACCEPT]),
      },
    });
    if (currentRegis) {
      throw new BadRequestException('you already registered this class');
    }
    //create registration and save
    const regis = this.repo.create();
    regis.user = user;
    regis.class = currentClass;
    await this.repo.save(regis);
    //send email to user
    await this.mailService.sendRegistrationLetter(user.email);

    return true;
  }

  async getMyRegistration(user: User) {
    const regis = await this.repo.find({ where: { userId: user.id } });
    return regis;
  }

  async cancelRegis(regisId: string) {
    const currentRegis = await this.repo.findOne({
      where: { regisId, status: regisStatus.PENDING },
    });
    if (!currentRegis)
      throw new NotFoundException('This class not pending or not exist');
    // delete regis if user cancel
    await this.repo.remove(currentRegis);
    return true;
  }

  async getAllRegistration(status: regisStatus) {
    const result = await this.repo
      .createQueryBuilder('regis')
      .where('status IN (:...status)', {
        status: status ? [status] : [...Object.values(regisStatus)],
      })
      .getMany();

    return result;
  }

  async submitRegistration(regisId: string, action: regisStatus) {
    const currentRegis = await this.repo.findOne({
      where: { regisId, status: regisStatus.PENDING },
      relations: ['user'],
    });

    if (!currentRegis)
      throw new NotFoundException('No pending registration with this id');

    const currentClass = await this.classService.findClassById(
      currentRegis.classId,
    );
    if (action === regisStatus.ACCEPT) {
      //check status of class open or close before accept
      if (currentClass.status !== classStatus.OPEN) {
        throw new BadRequestException('Can not submit ,class not open');
      }
      // increase currentStudent in class table
      await this.classService.incrementCurrentStudent(currentRegis.classId);
      //check if maxStudent = currentStudent , then update class status to close
      if (currentClass.maxStudent - currentClass.currentStudent === 1) {
        await this.classService.updateClass(currentRegis.classId, {
          status: 'close',
        } as UpdateClassDto);
      }
    }
    // update and save action
    currentRegis.status = action;
    await this.repo.save(currentRegis);
    //send email  for user
    await this.mailService.sendSubmitRegistration(
      currentRegis.user.email,
      action,
      currentClass.subject,
    );

    return true;
  }

  async viewUserInClass(classId: string) {
    const users = await this.repo
      .createQueryBuilder('regis')
      .select('regis.status')
      .leftJoinAndSelect('regis.user', 'user')
      .where('regis.classId = :id', { id: classId })
      .andWhere('regis.status = :status', { status: 'accept' })
      .getMany();

    return users;
  }
}
