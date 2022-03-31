import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Query,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Express } from 'express';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, multerFilter } from 'src/utils/multerUpload';
import { diskStorage } from 'multer';

@UseInterceptors(ClassSerializerInterceptor) // remove password when fetch user , read docs
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signUp(@Body() body: UserDTO) {
    return this.userService.createUser(body);
  }

  @Get('/verify/:token')
  verifyEmail(@Param('token') token) {
    return this.userService.verifyEmail(token);
  }

  @Post('/signin')
  login(@Body() body: UserDTO) {
    return this.userService.signIn(body);
  }

  @Get('/')
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard())
  findUser(@Query('email') email: string) {
    return this.userService.findUser(email);
  }

  @Get('/whoami')
  @UseGuards(AuthGuard())
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Patch('changePwd')
  @UseGuards(AuthGuard())
  changePassword(@CurrentUser() user: User, @Body() body) {
    return this.userService.changePassword(body.oldPwd, body.newPwd, user);
  }

  @Post('updateMe')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: 'public/user/avatar',
        filename: editFileName,
      }),
      fileFilter: multerFilter,
    }),
  )
  @UseGuards(AuthGuard())
  updateProfile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(user, file);
  }
}
