import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
    private cloudinary: CloudinaryService,
  ) {}

  async createUser({ email, password }: UserDTO) {
    const user = await this.repo.find({ email });
    //check email in use or not
    if (user.length) {
      throw new BadRequestException('email in use');
    }
    //hash password and save
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await this.repo.create({ email, password: hashedPassword });
    await this.repo.save(newUser);
    //create token
    const token = await this.jwtService.sign(
      { email },
      {
        expiresIn: '10m',
      },
    );
    //send email to user
    await this.mailService.sendUserConfirmation(email, token);
    //return response
    return {
      status: true,
      message: 'check your email within 3m to confirm account',
    };
  }

  async verifyEmail(token) {
    try {
      // check token is valid ?
      const decoded = await this.jwtService.verify(token);
      const { email } = decoded;
      const user = await this.findUser(email);
      // if user is valid , then update Active and save
      user.isActive = true;
      await this.repo.save(user);
      // return response
      return {
        status: true,
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        throw new UnauthorizedException('Your token has expired');
      if (err.name === 'JsonWebTokenError')
        throw new UnauthorizedException('Invalid token');
    }
  }

  async signIn({ email, password }: UserDTO) {
    const user = await this.findUser(email);
    // compare password
    const check = await bcrypt.compare(password, user.password);
    if (!check) throw new BadRequestException('Password not correct');
    if (!user.isActive)
      throw new BadRequestException('Please verify your account');
    const token = await this.jwtService.sign({ id: user.id });
    //return response
    return {
      token: token,
    };
  }

  async findUser(email: string) {
    // password dang set select = false o entity , nen phai select kieu nay
    const user = await this.repo
      .createQueryBuilder('user')
      .where('email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) throw new NotFoundException('Email not correct');
    return user;
  }

  async changePassword(oldPwd: string, newPwd: string, user: User) {
    //find User
    const currentUser = await this.findUser(user.email);
    //check old password is correct
    const check = await bcrypt.compare(oldPwd, currentUser.password);
    if (!check)
      throw new BadRequestException('Please insert correct old password');
    // if correct , hash new password
    const hashedPassword = await bcrypt.hash(newPwd, 8);
    currentUser.password = hashedPassword;
    await this.repo.save(currentUser);
    return true;
  }

  async uploadAvatar(user: User, file: Express.Multer.File) {
    const res = await this.cloudinary.uploadImage(file);
    user.avatarPath = res.url;
    this.repo.save(user);
    return user;
  }
}
