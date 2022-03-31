import { IsNotEmpty, IsEnum } from 'class-validator';
import { regisStatus } from '../registration.entity';

export class submitRegisDto {
  @IsNotEmpty()
  regisId: string;

  @IsNotEmpty()
  @IsEnum(regisStatus, {
    message: 'action must be accept or reject',
  })
  action: regisStatus;
}
