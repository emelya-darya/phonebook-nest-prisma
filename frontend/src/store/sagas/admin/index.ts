import { all, fork } from 'redux-saga/effects'
import { sagaWatcherAdminGetEmployees } from './getEmployeesListAdmin'
import { deleteEmployeeSagaWatcher } from './deleteEmployee'
import { updateEmployeeSagaWatcher } from './updateEmployee'
import { modalForExpandListSagaWatcher } from './modalForExpandList'
import { createEmployeeSagaWatcher } from './createEmployee'

export const adminSagaWatcher = function* () {
   yield all([
      fork(sagaWatcherAdminGetEmployees),
      fork(deleteEmployeeSagaWatcher),
      fork(updateEmployeeSagaWatcher),
      fork(modalForExpandListSagaWatcher),
      fork(createEmployeeSagaWatcher),
   ])
}
