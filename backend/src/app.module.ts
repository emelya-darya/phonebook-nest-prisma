import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmployeesModule } from './modules/employees/employees.module'
import { CompaniesModule } from './modules/companies/companies.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { FilesModule } from './modules/files/files.module'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import * as path from 'path'

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),

        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '..', 'static'),
        }),

        // SequelizeModule.forRoot({
        //    dialect: 'postgres',
        //    host: process.env.POSTGRES_HOST,
        //    port: +process.env.POSTGRES_PORT,
        //    username: process.env.POSTGRES_USER,
        //    password: process.env.POSTGRES_PASSWORD,
        //    database: process.env.POSTGRES_NAME,
        //    models: [Employee, Company, Admins],
        //    autoLoadModels: true,
        // }),
        EmployeesModule,
        CompaniesModule,
        FilesModule,
        AuthModule,
        PrismaModule,
    ],
})
export class AppModule {}
