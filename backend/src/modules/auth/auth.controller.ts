import { Body, Controller, Get, Headers, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Login_DTO } from './dto/incoming_data_dto/login.dto'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { JwtAuthGuard } from './jwt-auth.guard'
import {
    ApiBody,
    ApiCookieAuth,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { Succ_auth_ok_response_DTO } from './dto/responses_dto/succ_auth.dto'
import { Error_response_DTO, Unauthorized_err_response_DTO } from '../errors_response.dto'
import { Succ_add_new_admin_ok_response_DTO } from './dto/responses_dto/add_new_admin.dto'
import { Auth_error_response_DTO } from './dto/responses_dto/auth_error_response.dto'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Добавление нового администратора' })
    @ApiBody({ type: Login_DTO })
    @ApiOkResponse({ status: 200, type: Succ_add_new_admin_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnauthorizedResponse({ type: Unauthorized_err_response_DTO, description: 'Ответ со statusCode: 401 (нужно отправить refresh и повторить исходный запрос)' })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200 и 401' })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    @Post('registration')
    registration(@Body() loginDto: Login_DTO) {
        return this.authService.registration(loginDto)
    }

    @ApiOperation({ summary: 'Вход в панель управления' })
    @ApiBody({ type: Login_DTO })
    @ApiOkResponse({ status: 200, type: Succ_auth_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiForbiddenResponse({ type: Auth_error_response_DTO, description: 'Ответ с любым statusCode, кроме 200' })
    @Post('login')
    login(@Body() loginDto: Login_DTO, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(loginDto, response)
    }

    @ApiOperation({ summary: 'Получение новых access и refresh токенов' })
    @ApiOkResponse({ status: 200, type: Succ_auth_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiForbiddenResponse({ type: Auth_error_response_DTO, description: 'Ответ с любым statusCode, кроме 200' })
    @Get('refresh')
    refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        return this.authService.refresh(request, response)
    }
}
