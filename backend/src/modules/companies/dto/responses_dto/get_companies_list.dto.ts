import { ApiProperty } from '@nestjs/swagger'
import { One_company_DTO } from './get_company.dto'

export class Get_companies_list_ok_response_DTO {
   @ApiProperty({ example: 200 })
   readonly statusCode: number

   @ApiProperty({
      example: {
         totalCount: 15,
         items: [
            {
               company_id: 1,
               company_name: 'Название компании',
            },
            {
                company_id: 2,
                company_name: 'Название компании 2',
             },
            '...',
         ],
      },
   })
   readonly data: {
      totalCount: number
      items: Array<One_company_DTO>
   }
}
