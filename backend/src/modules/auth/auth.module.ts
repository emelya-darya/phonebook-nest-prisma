import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        PrismaModule,
        JwtModule.register({
            // secret: process.env.SECRET_KEY || 'd0nBm15Kmc6F',
            // signOptions: {
            //     expiresIn: '24h',
            // },
        }),
    ],
    exports: [JwtModule],
})
export class AuthModule {}
