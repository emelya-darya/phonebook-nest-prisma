import { ApiProperty } from '@nestjs/swagger'

export class Create_update_company_DTO {
   @ApiProperty({ example: 'Название компании' })
   readonly company_name: string
}
