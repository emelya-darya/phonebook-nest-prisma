import axios from 'axios'
import {
    CreateUpdateDeleteCompanyResponseType,
    EmployeeDataToSendForUpdateOrCreate,
    GetCompaniesListResponseType,
    GetEmpsPortionResponseType,
    OnCheckAuthResponseType,
    OnLoginResponseType,
    WithOneEmployeeResponseType,
} from '../commonTypes'

const instanceCommon = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL,
})

const instancePrivate = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL,
})

instancePrivate.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

instancePrivate.interceptors.response.use(
    config => config,
    async error => {
        const originalReq = error.config

        if (error?.response?.data?.statusCode === 401 && error.config && !error.config._isRetry) {
            originalReq._isRetry = true
            try {
                const refreshResponse = await instanceCommon.get<OnCheckAuthResponseType>(`/auth/refresh`).then(res => res.data)

                if (refreshResponse.statusCode === 200) {
                    localStorage.setItem('token', refreshResponse.data.accessToken)
                    return instancePrivate.request(originalReq)
                }
            } catch (err) {
                // console.log(err)
            }
        }
        throw error
    },
)

// photo может быть null | string | Blob
const createEmployeeFormData = function (employeeData: EmployeeDataToSendForUpdateOrCreate) {
    const { name, photo, position, inner_phone, mobile_phone, email, city, company_id, department, supervisor_id } = employeeData

    const formData = new FormData()

    formData.append('name', name)
    formData.append('position', position)
    formData.append('inner_phone', inner_phone)
    formData.append('mobile_phone', mobile_phone)
    formData.append('email', email)
    formData.append('city', city)
    formData.append('company_id', String(company_id))
    formData.append('department', department)
    formData.append('supervisor_id', String(supervisor_id))
    // formData.append('subordinates', JSON.stringify(subordinates))
    // formData.append('supervisor', JSON.stringify(supervisor))

    // photo может быть null | string | Blob
    // если null - удаляем существующее фото сотрудники и сотрудник теперь без фото
    // если string - значит у сотрудника уже есть photo и мы этот же путь до фото отправляем обратно
    // если Blob - загружаем новое фото
    if (photo === null) {
        formData.append('photo', 'null')
    } else if (typeof photo === 'string') {
        formData.append('photo', photo)
    } else if (typeof photo === 'object') {
        formData.append('photo', photo, 'image.png')
    }

    return formData
}

const employeesFetchingAPI = {
    async getEmployeesPortion(currentPage: number, pageSize: number, searchRequest: string = '', currentCompany: string = 'all') {
        return instanceCommon
            .get<GetEmpsPortionResponseType>(
                `/employees?term=${searchRequest}&page=${currentPage}&limit=${pageSize}&company=${currentCompany}`,
            )
            .then(response => response.data)
    },

    async getOneEmp(id: number) {
        return instanceCommon.get<WithOneEmployeeResponseType>(`/employee/${id}`).then(response => response.data)
    },

    async createEmployee(employeeData: EmployeeDataToSendForUpdateOrCreate) {
        const formData = createEmployeeFormData(employeeData)

        return instancePrivate
            .post<WithOneEmployeeResponseType>(`/employee`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => response.data)
    },

    async updateEmployee(id: number, employeeData: EmployeeDataToSendForUpdateOrCreate) {
        const formData = createEmployeeFormData(employeeData)

        return instancePrivate
            .put<WithOneEmployeeResponseType>(`/employee/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => response.data)
    },

    async deleteEmployee(id: number) {
        return instancePrivate.delete<WithOneEmployeeResponseType>(`/employee/${id}`).then(response => response.data)
    },
}

const companiesFetchingAPI = {
    async getCompanies() {
        return instanceCommon.get<GetCompaniesListResponseType>(`/companies`).then(response => response.data)
    },

    async createCompany(company_name: string) {
        return instancePrivate.post<CreateUpdateDeleteCompanyResponseType>(`/company`, { company_name }).then(response => response.data)
    },

    async updateCompany(company_id: number, company_name: string) {
        return instancePrivate
            .put<CreateUpdateDeleteCompanyResponseType>(`/company/${company_id}`, { company_name })
            .then(response => response.data)
    },

    async deleteCompany(company_id: number) {
        return instancePrivate.delete<CreateUpdateDeleteCompanyResponseType>(`/company/${company_id}`).then(response => response.data)
    },
}

const authorizationFetchingAPI = {
    async login(login: string, password: string) {
        return instanceCommon.post<OnLoginResponseType>(`auth/login`, { login, password }).then(response => response.data)
    },

    async checkAuth() {
        return instanceCommon.get<OnCheckAuthResponseType>(`/auth/refresh`).then(response => response.data)
    },
}

export { employeesFetchingAPI, companiesFetchingAPI, authorizationFetchingAPI }
