import { all, call, fork, put, takeLeading } from 'redux-saga/effects'
import { GET_EMPLOYEE_DATA_FOR_UPDATE, UPDATE_EMPLOYEE } from '../../redux/admin/constants'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { AdminAC } from '../../redux/admin/adminReducer'
import { employeesFetchingAPI } from '../../DAL/fetchingAPI'
import { cutText } from '../assets/cutText'
import { AuthAC } from '../../redux/auth/authReducer'

const sendNewDataSagaWorker = function* (action: ReturnType<typeof AdminAC.updateEmployee>) {
    yield put(ErrorsAC.setErrOnUpdateEmployee(null))
    yield put(AdminAC.setIsInProgressUpdateEmployee(true))

    try {
        const { statusCode, message, data } = yield call(employeesFetchingAPI.updateEmployee, action.id, action.employeeData)

        if (statusCode === 200) yield put(AdminAC.setEmployeeDataForUpdate(data))
        else throw new Error(message)
    } catch (err: any) {
        if (err?.response?.data?.statusCode === 403) yield put(AuthAC.removeAuthData())
        yield put(ErrorsAC.setErrOnUpdateEmployee(cutText(err.response?.data?.message || err.message, 50, 'Ошибка при обновлени данных')))
    }

    yield put(AdminAC.setIsInProgressUpdateEmployee(false))
}

const sendNewDataSagaWatcher = function* () {
    yield takeLeading(UPDATE_EMPLOYEE, sendNewDataSagaWorker)
}

const getInitialDataSagaWorker = function* (action: ReturnType<typeof AdminAC.getEmployeeDataForUpdate>) {
    yield put(ErrorsAC.setErrOnGetInitialDataForUpdatePage(null))
    yield put(AdminAC.setIsInProgressGetEmpDataForUpdate(true))

    try {
        const { statusCode, message, data } = yield call(employeesFetchingAPI.getOneEmp, action.id)

        if (statusCode === 200) {
            yield put(AdminAC.setEmployeeDataForUpdate(data))
        } else throw new Error(message)
    } catch (err: any) {
        yield put(
            ErrorsAC.setErrOnGetInitialDataForUpdatePage(
                cutText(err.response?.data?.message || err.message, 300, 'Ошибка при загрузке информации о сотруднике'),
            ),
        )
    }

    yield put(AdminAC.setIsInProgressGetEmpDataForUpdate(false))
}

const getInitialDataSagaWatcher = function* () {
    yield takeLeading(GET_EMPLOYEE_DATA_FOR_UPDATE, getInitialDataSagaWorker)
}

export const updateEmployeeSagaWatcher = function* () {
    yield all([fork(getInitialDataSagaWatcher), fork(sendNewDataSagaWatcher)])
}
