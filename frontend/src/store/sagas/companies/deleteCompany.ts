import { call, put, takeLeading } from 'redux-saga/effects'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { companiesFetchingAPI } from '../../DAL/fetchingAPI'
import { cutText } from '../assets/cutText'
import { DELETE_COMPANY } from '../../redux/companies/constants'
import { CompaniesAC } from '../../redux/companies/companiesReducer'
import { AuthAC } from '../../redux/auth/authReducer'

const deleteCompanySagaWorker = function* (action: ReturnType<typeof CompaniesAC.deleteCompany>) {
   yield put(ErrorsAC.addErrOnDeleteUpdateCompany(action.company_id, null))
   yield put(CompaniesAC.isInProgressDeleteCompany(action.company_id, true))

   try {
      // throw new Error()
      const { statusCode, data, message } = yield call(companiesFetchingAPI.deleteCompany, action.company_id)

      if (statusCode === 200) {
         yield put(CompaniesAC.removeCompanyFromStore(action.company_id))
      } else throw new Error(message)
   } catch (err: any) {
      if (err?.response?.data?.statusCode === 403) yield put(AuthAC.removeAuthData())
      yield put(
         ErrorsAC.addErrOnDeleteUpdateCompany(action.company_id, cutText(err.response?.data?.message || err.message, 40, 'Ошибка удаления'))
      )
   }

   yield put(CompaniesAC.isInProgressDeleteCompany(action.company_id, false))
}

export const deleteCompanySagaWatcher = function* () {
   yield takeLeading(DELETE_COMPANY, deleteCompanySagaWorker)
}
