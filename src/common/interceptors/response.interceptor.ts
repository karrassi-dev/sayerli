import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ReponseStandard<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ReponseStandard<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ReponseStandard<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in data && 'success' in data) {
          return data;
        }
        return {
          success: true,
          data: data ?? null,
        };
      }),
    );
  }
}
