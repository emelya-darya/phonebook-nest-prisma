import { ApiProperty } from '@nestjs/swagger'

class New_admin_data_DTO {
    readonly login: string
    readonly password: string
}

export class Succ_add_new_admin_ok_response_DTO {
    @ApiProperty({ example: 200 })
    readonly statusCode: number

    @ApiProperty({
        example: {
            login: 'admin-new',
            password: 'khfkhahgjhgjgggf',
        },
    })
    readonly data: New_admin_data_DTO
}
