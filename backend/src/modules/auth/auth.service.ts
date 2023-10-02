import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common'
import { Request } from 'express'
import { Login_DTO } from './dto/incoming_data_dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { ResponseOk } from '../responseOk'
import { PrismaService } from '../prisma/prisma.service'
import { Response } from 'express'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService, // @InjectModel(Admins) private adminsRepository: typeof Admins
    ) {}

    async registration(loginDto: Login_DTO) {
        const { login, password } = loginDto
        if (!login || !password) throw new HttpException('Empty login or password field', HttpStatus.UNPROCESSABLE_ENTITY)

        const searchAdm = await this.prismaService.admin.findUnique({ where: { login } })
        if (searchAdm) throw new HttpException('Admin with this login already exists', HttpStatus.UNPROCESSABLE_ENTITY)

        const hashPassword = await bcrypt.hash(password, 5)

        await this.prismaService.admin.create({
            data: {
                login,
                password: hashPassword,
            },
        })

        return new ResponseOk({ loginDto })
    }

    async login(loginDto: Login_DTO, response: Response) {
        const { login, password } = loginDto
        if (!login || !password) throw new HttpException('Empty login or password field', HttpStatus.UNPROCESSABLE_ENTITY)

        const admin = await this.prismaService.admin.findUnique({ where: { login } })
        if (!admin) throw new HttpException('User with this login does not exist', HttpStatus.FORBIDDEN)

        const comparePasswords = bcrypt.compareSync(password, admin.password)
        if (!comparePasswords) throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN)

        const accessToken = await this.generateAccessToken(admin.admin_id, admin.login)
        const refreshToken = await this.generateRefreshToken(admin.admin_id, admin.login)

        const userTokens = await this.prismaService.token.findMany({ where: { admin_id: admin.admin_id } })

        const userTokensId = userTokens.map(t => t.token_id)

        if (userTokensId.length) {
            const tokenIdForUpdate = userTokensId[0]

            if (userTokensId.length > 3) {
                userTokensId.shift()
                await this.prismaService.token.deleteMany({ where: { token_id: { in: userTokensId } } })
            }

            await this.prismaService.token.update({
                where: { token_id: tokenIdForUpdate },
                data: { refresh_token: refreshToken },
            })
        } else {
            await this.prismaService.token.create({ data: { refresh_token: refreshToken, admin_id: admin.admin_id } })
            // await this.prismaService.token.create({ data: { refresh_token: 'ddddddd', admin_id: 1 } })
        }

        response.cookie('RefreshToken', refreshToken, { httpOnly: true, secure: false })

        return new ResponseOk({
            accessToken,
            id: admin.admin_id,
            login: admin.login,
        })
    }
    // async checkAuth(tokenFromUser: string | undefined) {
    //    const token = tokenFromUser?.split(' ')[1]
    //    if (!token) throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED)
    //    // если токен невалидный, то автоматочески пробрасывается ошибка
    //  //   const decodedToken = JwtService.verify(tokenFromUser, process.env.SECRET_KEY)
    // }

    async refresh(request: Request, response: Response) {
        const refreshTokenFromReq = request.cookies['RefreshToken']
        if (!refreshTokenFromReq) throw new HttpException('User not authorized', HttpStatus.FORBIDDEN)
        this.validateRefreshToken(refreshTokenFromReq)

        const oldToken = await this.prismaService.token.findUnique({ where: { refresh_token: refreshTokenFromReq.trim() } })
        if (!oldToken) throw new HttpException('User not authorized', HttpStatus.FORBIDDEN)

        const adminData = await this.prismaService.admin.findUnique({ where: { admin_id: oldToken.admin_id } })
        if (!adminData) throw new HttpException('User not authorized', HttpStatus.FORBIDDEN)

        const newAccessToken = await this.generateAccessToken(adminData.admin_id, adminData.login)
        const newRefreshToken = await this.generateRefreshToken(adminData.admin_id, adminData.login)

        await this.prismaService.token.update({
            where: { refresh_token: oldToken.refresh_token },
            data: { refresh_token: newRefreshToken },
        })

        response.cookie('RefreshToken', newRefreshToken, { httpOnly: true, secure: false })

        return new ResponseOk({
            accessToken: newAccessToken,
            id: adminData.admin_id,
            login: adminData.login,
        })
    }

    private async generateAccessToken(id: number, login: string) {
        return this.jwtService.signAsync(
            { id, login },
            {
                secret: process.env.JWT_ACCESS_SECRET || '7Xz6&PKR3!e^2KqI',
                expiresIn: '15m',
                // expiresIn: '5s',
            },
        )
    }

    private async generateRefreshToken(id: number, login: string) {
        return this.jwtService.signAsync(
            { id, login },
            {
                secret: process.env.JWT_REFRESH_SECRET || 'JaCIurm1Q63F9eEYPEoz',
                expiresIn: '7d',
            },
        )
    }

    private validateRefreshToken(token: string) {
        return this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET || 'JaCIurm1Q63F9eEYPEoz' })
    }
}
