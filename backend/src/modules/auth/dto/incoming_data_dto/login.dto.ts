import { ApiProperty } from '@nestjs/swagger'

export class Login_DTO {
   @ApiProperty({ example: 'логин ппользователя' })
   readonly login: string

   @ApiProperty({ example: '12345678' })
   readonly password: string
}
