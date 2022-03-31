import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { SerializationInterceptor } from 'src/interceptors/serialization.interceptor';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { ShowRegisDTO } from './dto/show-regis.dto';
import { submitRegisDto } from './dto/submit-regis.dto';
import { regisStatus } from './registration.entity';
import { RegistrationService } from './registration.service';

@UseGuards(AuthGuard())
@Controller('registration')
export class RegistrationController {
  constructor(private regisService: RegistrationService) {}

  @Post('/')
  @UseInterceptors(new SerializationInterceptor(ShowRegisDTO))
  regisClass(@CurrentUser() user: User, @Body() body) {
    return this.regisService.createRegistration(user, body.classId);
  }

  @Get('/myregis')
  getMyRegistration(@CurrentUser() user: User) {
    return this.regisService.getMyRegistration(user);
  }

  @Delete('/:id')
  cancelRegis(@Param('id') id: string) {
    return this.regisService.cancelRegis(id);
  }

  @Get('/')
  @UseGuards(AdminGuard)
  getAllRegistration(@Query('status') status: regisStatus) {
    return this.regisService.getAllRegistration(status);
  }

  @Get('/viewUser')
  viewUserInClass(@Body() body) {
    return this.regisService.viewUserInClass(body.classId);
  }

  @Patch('/')
  @UseGuards(AdminGuard)
  submitRegistration(@Body() { regisId, action }: submitRegisDto) {
    return this.regisService.submitRegistration(regisId, action);
  }
}
