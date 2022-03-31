import { Expose } from 'class-transformer';

export class ShowRegisDTO {
  @Expose()
  regisId;

  @Expose()
  userId;

  @Expose()
  classId;

  @Expose()
  status;

  @Expose()
  regisDate;
}
