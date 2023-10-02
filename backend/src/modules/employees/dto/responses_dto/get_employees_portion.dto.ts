import { ApiProperty } from '@nestjs/swagger'
import { Get_one_employee_DTO } from './get_employee.dto'


export class Get_employees_portion_ok_response_DTO {
   @ApiProperty({ example: 200 })
   readonly statusCode: number

   @ApiProperty({
      example: {
         totalCount: 874,
         items: [
            {
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
                  {
                     employee_id: 4,
                     name: 'Имя подчиненного 2',
                  },
               ],
            },
            {
               employee_id: 2,
               name: 'Сергеев Сергей Сергеич',
               photo: null,
               position: null,
               inner_phone: null,
               mobile_phone: null,
               email: null,
               city: null,
               department: null,
               company: null,
               supervisor: null,
               subordinates: [],
            },
            '...',
         ],
      },
   })
   readonly data: {
      totalCount: number
      items: Array<Get_one_employee_DTO>
   }
}
