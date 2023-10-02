// dto - то простой объект, который не содержит в себе никакой логики и имеет только поля.
// Эти объекты предназначены для обмена данными между какими-то подсистемами (клиен - серверб или сервер - сервер или др)

import { ApiProperty } from "@nestjs/swagger"

export class Create_employee_DTO {
   @ApiProperty({ example: 'ФИО сотрудника' })
   readonly name: string

   @ApiProperty({ example: 'Файл изображения, прикрепленный в formData | null | undefined' })
   readonly photo: string | null | undefined

   @ApiProperty({ example: 'Название должности | null' })
   readonly position: string | null

   @ApiProperty({ example: 'Внутренний телефон | null' })
   readonly inner_phone: string | null

   @ApiProperty({ example: 'Мобильный телефон | null' })
   readonly mobile_phone: string | null

   @ApiProperty({ example: 'Адрес почты | null' })
   readonly email: string | null

   @ApiProperty({ example: 'Город | null' })
   readonly city: string | null

   @ApiProperty({ example: 'Название подразделения | null' })
   readonly department: string | null
   // readonly supervisor: string //строка типа SupervisorType
   // readonly subordinates: string //строка типа Array<SubordType>

   @ApiProperty({ example: 'id компании | null' })
   readonly company_id: number | null

   @ApiProperty({ example: 'id руководителя | null' })
   readonly supervisor_id: number | null
}


