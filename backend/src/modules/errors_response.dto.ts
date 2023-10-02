import { ApiProperty } from '@nestjs/swagger'

export class Error_response_DTO {
    @ApiProperty({ example: 422, description: 'Код ответа (любой, кроме 200)' })
    readonly statusCode: number

    @ApiProperty({ example: 'Краткое описание ошибки' })
    readonly message: string
}

export class Unauthorized_err_response_DTO {
    @ApiProperty({ example: 401, description: 'Код ответа, на который нужно отправить refresh и повторить исходный запрос' })
    readonly statusCode: number

    @ApiProperty({ example: 'Пользователь не авторизован' })
    readonly message: string
}
