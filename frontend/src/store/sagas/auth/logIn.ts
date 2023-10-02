import { call, put, takeLeading } from 'redux-saga/effects'
import { TRY_LOGIN } from '../../redux/auth/constants'
import { AuthAC } from '../../redux/auth/authReducer'
import { authorizationFetchingAPI } from '../../DAL/fetchingAPI'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { cutText } from '../assets/cutText'

const logInSagaWorker = function* (action: ReturnType<typeof AuthAC.tryLogin>) {
   yield put(ErrorsAC.setErrOnLogin(null))
   yield put(AuthAC.setIsInProgressLogin(true))

   try {
      const { statusCode, data, message } = yield call(authorizationFetchingAPI.login, action.dataForAuth.login, action.dataForAuth.password)

      if (statusCode === 200) {
         yield put(AuthAC.setAuthDataOnSuccessAuth(data))
         localStorage.setItem('token', data.accessToken)
      } else throw new Error(message)
   } catch (err: any) {
      yield put(ErrorsAC.setErrOnLogin(cutText(err.response?.data?.message || err.message, 40, 'Ошибка авторизации')))
   }

   yield put(AuthAC.setIsInProgressLogin(false))
}

export const logInSagaWatcher = function* () {
   yield takeLeading(TRY_LOGIN, logInSagaWorker)
}
