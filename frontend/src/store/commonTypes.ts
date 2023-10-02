export type GetActionWInferType<T> = T extends { [key: string]: infer U } ? U : never

export type SubordType = {
    employee_id: number
    name: string
}

export type CompanyData = {
    company_id: number
    company_name: string
}

export type SupervisorType = SubordType | null

export type EmployeeData = {
    employee_id: number
    name: string
    photo: string | null
    position: string | null
    inner_phone: string | null
    mobile_phone: string | null
    email: string | null

    city: string | null
    company: CompanyData | null
    department: string | null
    subordinates: Array<SubordType>
    supervisor: SupervisorType
}

type GenericResponceType<DataType = {}> =
    | {
          statusCode: 200
          data: DataType
      }
    | {
          statusCode: 403 | 404 | 422 | 500
          message: string
      }

export type EmployeeDataToSendForUpdateOrCreate = {
    name: string
    photo: Blob | string | null
    position: string
    inner_phone: string
    mobile_phone: string
    email: string
    city: string
    company_id: string
    department: string
    supervisor_id: number | null
}

export type GetEmpsPortionResponseType = GenericResponceType<{ totalCount: number; items: Array<EmployeeData> }>

export type WithOneEmployeeResponseType = GenericResponceType<EmployeeData>

export type SuccessLoginCheckAuthResponseDataType = {
    accessToken: string
    id: number
    login: string
}
export type OnLoginResponseType = GenericResponceType<SuccessLoginCheckAuthResponseDataType>

export type OnCheckAuthResponseType = GenericResponceType<SuccessLoginCheckAuthResponseDataType>

export type GetCompaniesListResponseType = GenericResponceType<{ totalCount: number; items: Array<CompanyData> }>

export type CreateUpdateDeleteCompanyResponseType = GenericResponceType<CompanyData>
