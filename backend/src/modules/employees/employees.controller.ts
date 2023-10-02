import {
    Body,
    Controller,
    Get,
    Post,
    UseInterceptors,
    UploadedFile,
    Delete,
    ParseIntPipe,
    Param,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { Create_employee_DTO } from './dto/incoming_data_dto/create_employee.dto'

import { FileInterceptor } from '@nestjs/platform-express'
import {
    ApiOperation,
    ApiQuery,
    ApiOkResponse,
    ApiTags,
    ApiUnprocessableEntityResponse,
    ApiBody,
    ApiParam,
    ApiConsumes,
    ApiCookieAuth,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Get_one_employee_ok_response_DTO } from './dto/responses_dto/get_employee.dto'
import { Get_employees_portion_ok_response_DTO } from './dto/responses_dto/get_employees_portion.dto'
import { Error_response_DTO, Unauthorized_err_response_DTO } from '../errors_response.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Сотрудники')
@Controller()
export class EmployeesController {
    constructor(private employeesService: EmployeesService) {}

    @ApiOperation({ summary: 'Получение порции записей' })
    @ApiOkResponse({ status: 200, type: Get_employees_portion_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200' })
    @ApiQuery({ name: 'page', type: Number, description: 'Номер страницы (по дефолту 1)', required: false })
    @ApiQuery({ name: 'limit', type: Number, description: 'Размер порции (по дефолту 20)', required: false })
    @ApiQuery({ name: 'term', type: String, description: 'Поисковый запрос (по дефолту пустая строка)', required: false })
    @ApiQuery({ name: 'company', type: String, description: 'id компании или "all" (по дефолту "all")', required: false })
    @Get('employees')
    getPortion(
        @Query('page') page?: string | undefined,
        @Query('limit') limit?: string | undefined,
        @Query('term') term?: string | undefined,
        @Query('company') company?: string | undefined,
    ) {
        const nPage = +page || 1
        const nLimit = +limit || 20
        const nTerm = term || ''
        const nCompany = +company ? +company : 'all'

        return this.employeesService.getEmployeesPortion(nPage, nLimit, nTerm, nCompany)
    }

    @ApiOperation({ summary: 'Создание новой записи (отправка FormData)' })
    // @ApiConsumes('multipart/form-data')
    @ApiBody({ type: Create_employee_DTO })
    @ApiOkResponse({ status: 200, type: Get_one_employee_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnauthorizedResponse({
        type: Unauthorized_err_response_DTO,
        description: 'Ответ со statusCode: 401 (нужно отправить refresh и повторить исходный запрос)',
    })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200 и 401' })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    @Post('employee')
    @UseInterceptors(FileInterceptor('photo'))
    create(@Body() reqBody: Create_employee_DTO & { employee_id?: number }, @UploadedFile() photo: any) {
        // на случай, если передан employee_id
        delete reqBody.employee_id
        return this.employeesService.createEmployee(reqBody, photo)
    }

    @ApiOperation({ summary: 'Обновление существующей записи (отправка FormData)' })
    // @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'id сотрудника' })
    @ApiBody({ type: Create_employee_DTO })
    @ApiOkResponse({ status: 200, type: Get_one_employee_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnauthorizedResponse({
        type: Unauthorized_err_response_DTO,
        description: 'Ответ со statusCode: 401 (нужно отправить refresh и повторить исходный запрос)',
    })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200 и 401' })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    @Put('employee/:id?')
    @UseInterceptors(FileInterceptor('photo'))
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() reqBody: Create_employee_DTO & { employee_id?: number },
        @UploadedFile() photo: any,
    ) {
        // на случай, если передан employee_id
        delete reqBody.employee_id
        return this.employeesService.updateEmployee(id, reqBody, photo)
    }

    @ApiOperation({ summary: 'Удаление записи' })
    @ApiParam({ name: 'id', description: 'id сотрудника' })
    @ApiOkResponse({ status: 200, type: Get_one_employee_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnauthorizedResponse({
        type: Unauthorized_err_response_DTO,
        description: 'Ответ со statusCode: 401 (нужно отправить refresh и повторить исходный запрос)',
    })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200 и 401' })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('employee/:id?')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.employeesService.deleteEmployee(id)
    }

    @ApiOperation({ summary: 'Получение одной записи' })
    @ApiParam({ name: 'id', description: 'id сотрудника' })
    @ApiOkResponse({ status: 200, type: Get_one_employee_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200' })
    @Get('employee/:id?')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.employeesService.getOne(id)
    }
}
