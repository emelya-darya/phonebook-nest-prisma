import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { Create_employee_DTO } from './dto/incoming_data_dto/create_employee.dto'
import { FilesService } from '../files/files.service'

import { ResponseOk } from '../responseOk'

import { Get_one_employee_DTO } from './dto/responses_dto/get_employee.dto'
import { PrismaService } from '../prisma/prisma.service'

// для того, чтобы сервис стал провайдером его нужно пометить аннотацией Injectable,
//поскольку в дальнейшем мы будем внедрять этот сервис в контроллер
@Injectable()
export class EmployeesService {
    constructor(
        private filesService: FilesService,
        private prismaService: PrismaService,
    ) {}

    async getEmployeesPortion(page: number = 1, limit: number = 20, term: string = '', company: 'all' | number = 'all') {
        const offset = limit * (page - 1)

        let employeesPortion: Array<Get_one_employee_DTO> = []
        let totalCount: number = 0

        const selectPart = {
            employee_id: true,
            name: true,
            photo: true,
            position: true,
            inner_phone: true,
            mobile_phone: true,
            email: true,
            city: true,
            department: true,
            company: true,
            supervisor: { select: { employee_id: true, name: true } },
            subordinates: { select: { employee_id: true, name: true } },
        }

        employeesPortion = await this.prismaService.employee.findMany({
            skip: offset,
            take: limit,
            where: {
                OR: [
                    { name: { contains: term, mode: 'insensitive' } },
                    { position: { contains: term, mode: 'insensitive' } },
                    { inner_phone: { contains: term, mode: 'insensitive' } },
                    { mobile_phone: { contains: term, mode: 'insensitive' } },
                    { email: { contains: term, mode: 'insensitive' } },
                    { city: { contains: term, mode: 'insensitive' } },
                    { department: { contains: term, mode: 'insensitive' } },
                ],
                AND: company === 'all' ? {} : { company_id: company },
            },
            select: selectPart,
        })
        totalCount = await this.prismaService.employee.count({
            where: {
                OR: [
                    { name: { contains: term, mode: 'insensitive' } },
                    { position: { contains: term, mode: 'insensitive' } },
                    { inner_phone: { contains: term, mode: 'insensitive' } },
                    { mobile_phone: { contains: term, mode: 'insensitive' } },
                    { email: { contains: term, mode: 'insensitive' } },
                    { city: { contains: term, mode: 'insensitive' } },
                    { department: { contains: term, mode: 'insensitive' } },
                ],
                AND: company === 'all' ? {} : { company_id: company },
            },
        })

        return new ResponseOk({ totalCount, items: employeesPortion })
    }

    async createEmployee(dto: Create_employee_DTO, photoFile: any) {
        const { name, company_id, supervisor_id } = dto
        if (!name) throw new HttpException('Employee name not specified, client error', HttpStatus.UNPROCESSABLE_ENTITY)

        // путь к изображению будет /phonebook/имя_изображения.png  (может вернуть путь, null или undefined)
        const newPhotoValue = await this.filesService.imageHandler(photoFile, dto.photo, ['phonebook'])

        const newEmployee = await this.prismaService.employee.create({
            data: {
                ...dto,
                company_id: String(company_id) === 'null' ? null : +company_id || null,
                supervisor_id: String(supervisor_id) === 'null' ? null : +supervisor_id || null,
                photo: newPhotoValue,
            },
        })

        return await this.getOne(newEmployee.employee_id)
    }

    async updateEmployee(id: number, dto: Create_employee_DTO, photoFile: any) {
        const { name, company_id, supervisor_id } = dto
        if (!name) throw new HttpException('Employee name not specified, client error', HttpStatus.UNPROCESSABLE_ENTITY)

        // путь к изображению будет /phonebook/имя_изображения.png  (может вернуть путь, null или undefined)
        const newPhotoValue = await this.filesService.imageHandler(photoFile, dto.photo, ['phonebook'])

        await this.prismaService.employee.update({
            where: {
                employee_id: id,
            },
            data: {
                ...dto,
                company_id: String(company_id) === 'null' ? null : +company_id || null,
                supervisor_id: String(supervisor_id) === 'null' ? null : +supervisor_id || null,
                photo: newPhotoValue,
            },
        })

        return await this.getOne(id)
    }

    async deleteEmployee(id: number) {
        const empToDelete = await this.getOne(id)

        await this.prismaService.employee.delete({
            where: {
                employee_id: id,
            },
        })

        return empToDelete
    }

    async getOne(id: number) {
        const employee = await this.prismaService.employee.findUnique({
            where: {
                employee_id: id,
            },
            select: {
                employee_id: true,
                name: true,
                photo: true,
                position: true,
                inner_phone: true,
                mobile_phone: true,
                email: true,
                city: true,
                department: true,

                company: true,
                supervisor: { select: { employee_id: true, name: true } },
                subordinates: { select: { employee_id: true, name: true } },
            },
        })

        if (!employee) throw new HttpException('There is no employee with this id in the database', HttpStatus.UNPROCESSABLE_ENTITY)

        return new ResponseOk(employee)
    }

    // async getSubordinatesList(supervisor_id: number) {
    //    const subordinates = await this.employeeRepository.findAll({
    //       where: { supervisor_id: supervisor_id },
    //       attributes: ['employee_id', 'name'],
    //    })

    //    return subordinates.map(s => s.dataValues)
    // }
}
