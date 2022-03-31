import { Class } from 'src/class/class.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum regisStatus {
  PENDING = 'pending',
  ACCEPT = 'accept',
  REJECT = 'reject',
}

@Entity()
export class Registration {
  @PrimaryGeneratedColumn()
  regisId!: number;

  @Column()
  userId!: string;

  @Column()
  classId!: string;

  @Column({
    type: 'enum',
    enum: regisStatus,
    default: regisStatus.PENDING,
  })
  status!: regisStatus;

  @CreateDateColumn()
  regisDate!: Date;

  @ManyToOne(() => User, (user) => user.regisId)
  user!: User;

  @ManyToOne(() => Class, (classId) => classId.regisId, { onDelete: 'CASCADE' })
  class!: Class;
}
