import { call, put, takeLeading } from 'redux-saga/effects'
import { AdminAC } from '../../redux/admin/adminReducer'
import { DELETE_EMPLOYEE } from '../../redux/admin/constants'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { employeesFetchingAPI } from '../../DAL/fetchingAPI'
import { cutText } from '../assets/cutText'
import { AuthAC } from '../../redux/auth/authReducer'

const deleteEmployeeSagaWorker = function* (action: ReturnType<typeof AdminAC.deleteEmployee>) {
    yield put(ErrorsAC.addErrOnDeleteEmployee(action.id, null))
    yield put(AdminAC.isInProgressDeleteEmployee(action.id, true))

    try {
        const { statusCode, message } = yield call(employeesFetchingAPI.deleteEmployee, action.id)

        if (statusCode === 200) {
            yield put(AdminAC.addEmployeeToDeleted(action.id))
        } else throw new Error(message)
    } catch (err: any) {
        if (err?.response?.data?.statusCode === 403) yield put(AuthAC.removeAuthData())
        yield put(ErrorsAC.addErrOnDeleteEmployee(action.id, cutText(err.response?.data?.message || err.message, 40, 'Ошибка удаления')))
    }

    yield put(AdminAC.isInProgressDeleteEmployee(action.id, false))
}

export const deleteEmployeeSagaWatcher = function* () {
    yield takeLeading(DELETE_EMPLOYEE, deleteEmployeeSagaWorker)
}
