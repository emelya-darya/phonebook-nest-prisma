import { JwtService } from '@nestjs/jwt'
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()

        try {
            const authHeader: string | undefined = req?.headers?.authorization
            const bearer = authHeader?.split(' ')[0]
            const token = authHeader?.split(' ')[1]
            if (bearer !== 'Bearer' || !token) throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED)

            const user = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET || '7Xz6&PKR3!e^2KqI' })
        } catch (err) {
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED)
        }

        return true
    }
}
