import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();
    const rpcErrorString = rpcError.toString();

    if (rpcErrorString.includes('Empty response')) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: rpcErrorString.substring(0, rpcErrorString.indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(rpcError.status)
        ? HttpStatus.BAD_REQUEST
        : +rpcError.status;
      return response.status(status).json(rpcError);
    }
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(rpcError);
  }
}
