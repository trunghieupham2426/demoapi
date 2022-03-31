import { Exclude } from 'class-transformer';
import { Class } from 'src/class/class.entity';
import { Registration } from 'src/registration/registration.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    default:
      'https://res.cloudinary.com/dyw35assc/image/upload/v1644906261/DEV/default_gphmz1.png',
  })
  avatarPath: string;

  @OneToMany(() => Class, (classes) => classes.createBy)
  classes: Class[];

  @OneToMany(() => Registration, (regisId) => regisId.user)
  regisId: Registration[];
}
