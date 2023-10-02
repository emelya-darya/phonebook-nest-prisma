import { Module } from '@nestjs/common'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    controllers: [CompaniesController],
    providers: [CompaniesService],
    imports: [AuthModule, PrismaModule],
})
export class CompaniesModule {}
