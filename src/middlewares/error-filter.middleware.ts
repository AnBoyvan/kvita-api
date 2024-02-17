import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { CONST } from 'src/constants';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message || this.getErrorMessage(status);

    response.status(status).json({
      statusCode: status || 500,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorMessage(status: number): string {
    if (CONST.Errors[status]) {
      return CONST.Errors[status];
    }
    return CONST.Errors[500];
  }
}
