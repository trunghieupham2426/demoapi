import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Registration } from 'src/registration/registration.entity';

export enum classStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
}

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  subject: string;

  @Column()
  maxStudent: number;

  @Column({ default: 0 })
  currentStudent: number;

  @Column({
    type: 'enum',
    enum: classStatus,
    default: classStatus.PENDING,
  })
  status: classStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  createById;

  @ManyToOne(() => User, (user) => user.classes)
  createBy: User;

  @OneToMany(() => Registration, (regisId) => regisId.class)
  regisId: Registration[];
}
