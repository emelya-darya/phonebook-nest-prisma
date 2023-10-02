import { all, fork } from 'redux-saga/effects'
import { checkAuthSagaWatcher } from './checkAuth'
import { logInSagaWatcher } from './logIn'

export const authSagaWatcher = function* () {
   yield all([fork(checkAuthSagaWatcher), fork(logInSagaWatcher)])
}
