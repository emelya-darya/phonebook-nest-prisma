import { call, put, takeLeading } from 'redux-saga/effects'
import { CREATE_EMPLOYEE } from '../../redux/admin/constants'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { AdminAC } from '../../redux/admin/adminReducer'
import { employeesFetchingAPI } from '../../DAL/fetchingAPI'
import { cutText } from '../assets/cutText'
import { AuthAC } from '../../redux/auth/authReducer'

export const createEmployeeSagaWorker = function* (action: ReturnType<typeof AdminAC.createEmployee>) {
    yield put(ErrorsAC.setErrOnCreateEmployee(null))
    yield put(AdminAC.setIsInProgressCreateEmployee(true))

    try {
        const { statusCode, message, data } = yield call(employeesFetchingAPI.createEmployee, action.employeeData)
        if (statusCode === 200) {
            yield put(AdminAC.setInitialEmployeeDataForCreatePage({ ...data, employee_id: -1 }))
            yield put(AdminAC.expandEmployeesPortionForModal([data]))
        } else throw new Error(message)

        // if (statusCode !== 200) throw new Error(message)
    } catch (err: any) {
        if (err?.response?.data?.statusCode === 403) yield put(AuthAC.removeAuthData())
        yield put(
            ErrorsAC.setErrOnCreateEmployee(cutText(err.response?.data?.message || err.message, 50, 'Ошибка при создании новой записи')),
        )
    }

    yield put(AdminAC.setIsInProgressCreateEmployee(false))
}

export const createEmployeeSagaWatcher = function* () {
    yield takeLeading(CREATE_EMPLOYEE, createEmployeeSagaWorker)
}
