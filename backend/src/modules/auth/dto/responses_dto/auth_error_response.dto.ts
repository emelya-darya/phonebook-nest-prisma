import { ApiProperty } from '@nestjs/swagger'

export class Auth_error_response_DTO {
    @ApiProperty({ example: 403, description: 'Код ответа (любой, кроме 200)' })
    readonly statusCode: number

    @ApiProperty({ example: 'Пользователь не авторизован' })
    readonly message: string
}
