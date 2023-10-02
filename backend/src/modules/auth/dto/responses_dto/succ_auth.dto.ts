import { ApiProperty } from '@nestjs/swagger'

class Admin_data_DTO {
    // @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
    readonly accessToken: string
    readonly id: number
    readonly login: string
}

export class Succ_auth_ok_response_DTO {
    @ApiProperty({ example: 200 })
    readonly statusCode: number

    @ApiProperty({
        example: {
            accessToken: 'jwt-access-token-example',
            id: 1,
            login: 'admin',
        },
    })
    readonly data: Admin_data_DTO
}
