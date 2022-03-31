import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { ClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(@InjectRepository(Class) private repo: Repository<Class>) {}

  async createClass(body: ClassDto, user: User) {
    const Class = await this.repo.create(body);
    Class.createBy = user;
    await this.repo.save(Class);
    return Class;
  }

  async updateClass(id: string, body: UpdateClassDto) {
    const currentClass = await this.findClassById(id);
    const startDate = currentClass.startDate;
    if (new Date(body.endDate) < new Date(startDate)) {
      throw new BadRequestException('endDate must greater than startDate');
    }
    Object.assign(currentClass, body);
    await this.repo.save(currentClass);
    return currentClass;
  }

  async findClassById(id: string) {
    const currentClass = await this.repo.findOne({ id });
    if (!currentClass) throw new NotFoundException('No class with  this id');
    return currentClass;
  }

  async deleteClass(id: string) {
    const currentClass = await this.findClassById(id);
    if (currentClass.currentStudent !== 0)
      throw new BadRequestException('Can not delete , class has student');
    await this.repo.remove(currentClass);
    return true;
  }

  async incrementCurrentStudent(classId: string) {
    await this.repo.increment({ id: classId }, 'currentStudent', '1');
  }
}
