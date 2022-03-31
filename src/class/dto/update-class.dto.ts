import { IsDateString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ValidateStartDate } from '../decorators/CompareDate.decorator';

enum statusUpdate {
  OPEN = 'open',
  CLOSE = 'close',
}

export class UpdateClassDto {
  @IsOptional()
  @IsNotEmpty()
  subject: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(statusUpdate, {
    message: 'status must be open or close',
  })
  status: statusUpdate;

  @IsOptional()
  @IsNotEmpty()
  maxStudent: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ValidateStartDate('endDate', {
    message: 'startDate must greater than today and smaller than endDate',
  })
  startDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
