import { all, fork } from 'redux-saga/effects'
import { sagaWatcherGetEmployees } from './getEmployeesList'
import { sagaWatcherOnOpenEmployeeModal } from './onOpenModal'

export const employeesSagaWatcher = function* () {
   yield all([fork(sagaWatcherGetEmployees), fork(sagaWatcherOnOpenEmployeeModal)])
}
