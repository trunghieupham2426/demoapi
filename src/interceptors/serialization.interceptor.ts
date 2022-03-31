import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  constructor(private dto) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before...');

    return next.handle().pipe(
      map((data: any) => {
        // console.log(data); data la instance cua Entity
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
