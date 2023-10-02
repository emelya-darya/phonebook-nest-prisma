import { CompanyType, SubordSupervisorType } from '../../commonTypes'
import { ApiProperty } from '@nestjs/swagger'

// Тип возвращаемщй с сервера записи сотрудника
export class Get_one_employee_DTO {
   // @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
   readonly employee_id: number

   // @ApiProperty({ example: 'Иванов Иван Иванович', description: 'Имя сотрудника' })
   readonly name: string

   // @ApiProperty({ example: '/phonebook/0bd2ab56-9119-4fc5-a637-c5356f67e21e.png', description: 'Путь до изображения с аватаркой' })
   readonly photo: string | null | undefined

   // @ApiProperty({ example: 'Руководитель всего', description: 'Должность' })
   readonly position: string | null

   // @ApiProperty({ example: '00-01', description: 'Внутренний телефон' })
   readonly inner_phone: string | null

   // @ApiProperty({ example: '+7(800)555-35-35', description: 'Мобильный телефон' })
   readonly mobile_phone: string | null

   // @ApiProperty({ example: 'mail@mail.ru', description: 'Почта' })
   readonly email: string | null

   // @ApiProperty({ example: 'Москва', description: 'Город' })
   readonly city: string | null

   // @ApiProperty({ example: 'Разработка ПО', description: 'Подразделение' })
   readonly department: string | null

   // @ApiProperty({ example: { company_id: 4, company_name: 'Название компании' }, description: 'Информация о компании' })
   readonly company: CompanyType

   // @ApiProperty({ example: { employee_id: 2, name: 'Сергеев Сергей Сергеич' }, description: 'Руководитель' })
   readonly supervisor: SubordSupervisorType | null

   // @ApiProperty({
   //    example: [
   //       { employee_id: 3, name: 'Имя подчиненного 1' },
   //       { employee_id: 4, name: 'Имя подчиненного 2' },
   //    ],
   //    description: 'Подчиненные',
   // })
   readonly subordinates: Array<SubordSupervisorType>
}

export class Get_one_employee_ok_response_DTO {
   @ApiProperty({ example: 200 })
   readonly statusCode: number

   @ApiProperty({
      example: {
         employee_id: 1,
         name: 'Иванов Иван Иванович',
         photo: '/phonebook/0bd2ab56-9119-4fc5-a637-c5356f67e21e.png',
         position: 'Руководитель всего',
         inner_phone: '00-01',
         mobile_phone: '+7(800)555-35-35',
         email: 'mail@mail.ru',
         city: 'Москва',
         department: 'Разработка ПО',
         company: {
            company_id: 4,
            company_name: 'Название компании',
         },
         supervisor: {
            employee_id: 2,
            name: 'Сергеев Сергей Сергеич',
         },
         subordinates: [
            {
               employee_id: 3,
               name: 'Имя подчиненного 1',
            },
         ],
      },
   })
   readonly data: Get_one_employee_DTO
}
