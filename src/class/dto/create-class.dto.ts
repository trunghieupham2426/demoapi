import { IsNotEmpty, IsDateString } from 'class-validator';
import { ValidateStartDate } from '../decorators/CompareDate.decorator';

export class ClassDto {
  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  maxStudent: number;

  @IsNotEmpty()
  @IsDateString()
  @ValidateStartDate('endDate', {
    message: 'startDate must greater than today and smaller than endDate',
  })
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
