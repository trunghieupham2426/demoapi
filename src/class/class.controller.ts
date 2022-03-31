import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { SerializationInterceptor } from 'src/interceptors/serialization.interceptor';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { ClassService } from './class.service';
import { ClassDto } from './dto/create-class.dto';
import { ShowClassDTO } from './dto/show-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@UseGuards(AdminGuard)
@UseGuards(AuthGuard())
@Controller('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Post()
  @UseInterceptors(new SerializationInterceptor(ShowClassDTO))
  createClass(@Body() body: ClassDto, @CurrentUser() user: User) {
    return this.classService.createClass(body, user);
  }

  @Patch('/:id')
  updateClass(@Param('id') id: string, @Body() body: UpdateClassDto) {
    return this.classService.updateClass(id, body);
  }

  @Delete('/:id')
  deleteClass(@Param('id') id: string) {
    return this.classService.deleteClass(id);
  }

  @Get('/:id')
  findClass(@Param('id') id: string) {
    return this.classService.findClassById(id);
  }
}
