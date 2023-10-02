// import { Company } from 'src/companies/companies.model'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ResponseOk } from '../responseOk'
import { Create_update_company_DTO } from './dto/incoming_data_dto/create_update_company.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CompaniesService {
    constructor(private prismaService: PrismaService) {}

    async getAll() {
        const allCompanies = await this.prismaService.company.findMany()
        return new ResponseOk({ totalCount: allCompanies.length, items: allCompanies })
    }

    async createCompany(dto: Create_update_company_DTO) {
        if (!dto.company_name) throw new HttpException('Сompany name not set (client error)', HttpStatus.UNPROCESSABLE_ENTITY)

        const newCompany = await this.prismaService.company.create({
            data: {
                company_name: dto.company_name,
            },
        })
        return new ResponseOk({ company_id: newCompany.company_id, company_name: newCompany.company_name })
    }

    async updateCompany(id: number, dto: Create_update_company_DTO) {
        const { company_name } = dto

        if (!company_name) throw new HttpException('Сompany name not set (client error)', HttpStatus.UNPROCESSABLE_ENTITY)

        const updatedCompany = await this.prismaService.company.update({
            where: {
                company_id: id,
            },
            data: {
                company_name,
            },
        })
        return new ResponseOk(updatedCompany)
    }

    async deleteCompany(id: number) {
        const companyToDelete = await this.prismaService.company.delete({
            where: {
                company_id: id,
            },
        })
        return new ResponseOk(companyToDelete)
    }
}
