import { Module } from '@nestjs/common'
import { EmployeesController } from './employees.controller'
import { EmployeesService } from './employees.service'
// import { Employee } from './employees.model'
import { FilesModule } from '../files/files.module'
// import { Company } from 'src/companies/companies.model'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    controllers: [EmployeesController],
    providers: [EmployeesService, PrismaService],
    imports: [
        // SequelizeModule.forFeature([Employee, Company]),
        FilesModule,
        AuthModule,
        PrismaModule,
    ],
})
export class EmployeesModule {}
