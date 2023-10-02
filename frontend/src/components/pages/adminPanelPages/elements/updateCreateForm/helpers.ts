import { EmployeeData, EmployeeDataToSendForUpdateOrCreate } from '../../../../../store/commonTypes'

const regEmail: RegExp =
    /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const regForMobilePhone: RegExp = /[^\d\(\)\+\s-]+/g

const regForInnerPhone: RegExp = /[^\d-]+/

// если пустая строка или null - возвращает null
const formatValueToCompare = (value: string | null) => {
    if (value === null || !value.trim()) return null
    return value.trim()
}

// функция для сравнения данных с сервера и данных в локальном state
const isEqualValuesInObjects = (
    // initialData: EmployeeData | EmployeeDataToSendForUpdateOrCreate,
    // dataToSend: EmployeeData | EmployeeDataToSendForUpdateOrCreate
    initialData: EmployeeData,
    dataToSend: EmployeeDataToSendForUpdateOrCreate,
): boolean => {
    if (initialData.name !== dataToSend.name.trim()) return false
    if (formatValueToCompare(initialData.position) !== formatValueToCompare(dataToSend.position)) return false
    if (formatValueToCompare(initialData.inner_phone) !== formatValueToCompare(dataToSend.inner_phone)) return false
    if (formatValueToCompare(initialData.mobile_phone) !== formatValueToCompare(dataToSend.mobile_phone)) return false
    if (formatValueToCompare(initialData.email) !== formatValueToCompare(dataToSend.email)) return false
    if (formatValueToCompare(initialData.city) !== formatValueToCompare(dataToSend.city)) return false
    if (formatValueToCompare(initialData.department) !== formatValueToCompare(dataToSend.department)) return false

    const companyFromInitialData = initialData.company === null ? 'null' : String(initialData.company.company_id)
    if (companyFromInitialData !== dataToSend.company_id) return false

    if (initialData.photo !== dataToSend.photo) return false

    // if (initialData.supervisor.id !== dataToSend.supervisor.id || initialData.supervisor.name !== dataToSend.supervisor.name) return false

    if (initialData.supervisor === null) {
        if (dataToSend.supervisor_id !== null) return false
        else return true
    } else {
        if (initialData.supervisor.employee_id !== dataToSend.supervisor_id) return false
        else return true
    }
}

export { isEqualValuesInObjects, regEmail, regForInnerPhone, regForMobilePhone }
