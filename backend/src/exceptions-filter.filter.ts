import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

@Catch(Error)
export class AllExceptionsFilter<T> implements ExceptionFilter {
   catch(exception: Error | HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      // const request = ctx.getRequest<Request>()

      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

      let message: string
      if (exception instanceof HttpException) {
         const excResp = exception.getResponse()
         //@ts-ignore
         message = typeof excResp === 'string' ? excResp : excResp?.message || excResp?.error || 'Unexpected server error'
      } else {
         message = exception?.message || 'Unexpected server error'
      }

      console.log(message)
     
      //@ts-ignore
      response.status(status).json({
         statusCode: status,
         message,
      })
   }
}
