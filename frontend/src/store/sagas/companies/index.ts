import { all, fork } from 'redux-saga/effects'
import { getCompaniesListSagaWatcher } from './getCompaniesList'
import { createNewCompanySagaWatcher } from './createNewCompany'
import { deleteCompanySagaWatcher } from './deleteCompany'
import { updateCompanySagaWatcher } from './updateCompany'

export const companiesSagaWatcher = function* () {
   yield all([
      fork(getCompaniesListSagaWatcher),
      fork(createNewCompanySagaWatcher),
      fork(deleteCompanySagaWatcher),
      fork(updateCompanySagaWatcher),
   ])
}
