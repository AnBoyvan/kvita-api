// import {
//   Catch,
//   ExceptionFilter,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';

// @Catch()
// export class ErrorFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     const context = host.switchToHttp();
//     const response = context.getResponse<Response>();
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     response.status(status).json({
//       statusCode: status,
//       message: exception.message,
//     });
//   }
// }
