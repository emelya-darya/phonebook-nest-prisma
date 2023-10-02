import { ApiProperty } from '@nestjs/swagger'

export class One_company_DTO {
   // @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
   readonly company_id: number
   readonly company_name: string
}

export class Get_one_company_ok_response_DTO {
   @ApiProperty({ example: 200 })
   readonly statusCode: number

   @ApiProperty({
      example: {
         company_id: 1,
         company_name: 'Название компании',
      },
   })
   readonly data: One_company_DTO
}
