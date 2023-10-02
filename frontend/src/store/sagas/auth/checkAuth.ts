import { call, put, takeLeading } from 'redux-saga/effects'
import { CHECK_AUTH } from '../../redux/auth/constants'
import { AuthAC } from '../../redux/auth/authReducer'
import { authorizationFetchingAPI } from '../../DAL/fetchingAPI'

const checkAuthSagaWorker = function* () {
    yield put(AuthAC.setIsInProgressCheckAuth(true))

    try {
        const { statusCode, data } = yield call(authorizationFetchingAPI.checkAuth)

        if (statusCode === 200) {
            yield put(AuthAC.setAuthDataOnSuccessAuth(data))
            localStorage.setItem('token', data.accessToken)
        }
    } catch (err: any) {}
    yield put(AuthAC.setIsAuthStatusChecked())
    yield put(AuthAC.setIsInProgressCheckAuth(false))
}

export const checkAuthSagaWatcher = function* () {
    yield takeLeading(CHECK_AUTH, checkAuthSagaWorker)
}
