import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error occurred.', error: 'InternalServerError' };

    const message =
      typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
        ? (errorResponse as any).message
        : (exception as any)?.message || 'An unexpected error occurred.';

    const errorType =
      typeof errorResponse === 'object' && errorResponse !== null && 'error' in errorResponse
        ? (errorResponse as any).error
        : 'InternalServerError';

    // Redact sensitive details in production
    if (status >= 500) {
      this.logger.error(`[500 ERROR] ${request.method} ${request.url} - ${message}`, (exception as any)?.stack);
    } else {
      this.logger.warn(`[${status} REJECTED] ${request.method} ${request.url} - ${JSON.stringify(message)}`);
    }

    response.status(status).json({
      statusCode: status,
      error: errorType,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
