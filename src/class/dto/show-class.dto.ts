import { Expose, Transform } from 'class-transformer';

export class ShowClassDTO {
  @Expose()
  id;
  @Expose()
  subject;
  @Expose()
  maxStudent;
  @Expose()
  currentStudent;
  @Expose()
  startDate;
  @Expose()
  endDate;
  @Expose()
  createById;
  @Expose()
  status;
}
