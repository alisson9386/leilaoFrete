import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { LoggerService } from './service/logger.service'; // Substitua pelo caminho correto para o arquivo do serviço de log
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const method = request.method;
      const url = request.url;
      const now = Date.now();
  
      this.logger.log(`[${method}] ${url} - Request received`);
  
      return next.handle().pipe(
        tap(() => {
          this.logger.log(
            `[${method}] ${url} - Response sent - ${Date.now() - now}ms`,
          );
        }),
      );
    }
  }
  