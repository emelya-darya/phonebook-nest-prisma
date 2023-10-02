import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { Create_update_company_DTO } from './dto/incoming_data_dto/create_update_company.dto'
import { ApiBody, ApiCookieAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger'
import { Get_companies_list_ok_response_DTO } from './dto/responses_dto/get_companies_list.dto'
import { Error_response_DTO, Unauthorized_err_response_DTO } from '../errors_response.dto'
import { Get_one_company_ok_response_DTO } from './dto/responses_dto/get_company.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Компании')
@Controller()
export class CompaniesController {
    constructor(private companiesService: CompaniesService) {}

    @ApiOperation({ summary: 'Получение всех записей' })
    @ApiOkResponse({ status: 200, type: Get_companies_list_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200' })
    @Get('companies')
    getAll() {
        return this.companiesService.getAll()
    }

    @ApiOperation({ summary: 'Создание новой записи' })
    @ApiBody({ type: Create_update_company_DTO })
    @ApiOkResponse({ status: 200, type: Get_one_company_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    // @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200' })
    @ApiUnauthorizedResponse({ type: Unauthorized_err_response_DTO, description: 'Ответ со statusCode: 401 (нужно отправить refresh и повторить исходный запрос)' })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200 и 401' })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    @Post('company')
    create(@Body() reqBody: Create_update_company_DTO & { company_id?: number }) {
        delete reqBody.company_id
        return this.companiesService.createCompany(reqBody)
    }

    @ApiOperation({ summary: 'Обновление существующей записи' })
    @ApiParam({ name: 'id', description: 'id компании' })
    @ApiBody({ type: Create_update_company_DTO })
    @ApiOkResponse({ status: 200, type: Get_one_company_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnauthorizedResponse({ type: Unauthorized_err_response_DTO, description: 'Ответ со statusCode: 401 (нужно отправить refresh и повторить исходный запрос)' })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200 и 401' })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    @Put('company/:id?')
    update(@Param('id', ParseIntPipe) id: number, @Body() reqBody: Create_update_company_DTO & { company_id?: number }) {
        delete reqBody.company_id
        return this.companiesService.updateCompany(id, reqBody)
    }

    @ApiOperation({ summary: 'Удаление записи' })
    @ApiParam({ name: 'id', description: 'id компании' })
    @ApiOkResponse({ status: 200, type: Get_one_company_ok_response_DTO, description: 'Ответ со statusCode: 200' })
    @ApiUnauthorizedResponse({ type: Unauthorized_err_response_DTO, description: 'Ответ со statusCode: 401 (нужно отправить refresh и повторить исходный запрос)' })
    @ApiUnprocessableEntityResponse({ type: Error_response_DTO, description: 'Ответ с любым statusCode, кроме 200 и 401' })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('company/:id?')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.companiesService.deleteCompany(id)
    }
}
