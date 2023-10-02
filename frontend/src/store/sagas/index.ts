import { all, fork } from 'redux-saga/effects'
import { employeesSagaWatcher } from './employees'
import { authSagaWatcher } from './auth'
import { adminSagaWatcher } from './admin'
import { companiesSagaWatcher } from './companies'

function* rootSaga() {
   yield all([fork(employeesSagaWatcher), fork(authSagaWatcher), fork(adminSagaWatcher), fork(companiesSagaWatcher)])
}

export { rootSaga }
