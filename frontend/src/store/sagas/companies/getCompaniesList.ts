import { call, put, takeLeading } from 'redux-saga/effects'
import { GET_COMPANIES_LIST } from '../../redux/companies/constants'
import { CompaniesAC } from '../../redux/companies/companiesReducer'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { cutText } from '../assets/cutText'
import { companiesFetchingAPI } from '../../DAL/fetchingAPI'

const getCompaniesListSagaWorker = function* () {
   yield put(ErrorsAC.setErrOnGetCompaniesList(null))
   yield put(CompaniesAC.setIsLoadingCompaniesList(true))
   try {
      const { statusCode, data, message } = yield call(companiesFetchingAPI.getCompanies)

      if (statusCode === 200) {
         yield put(CompaniesAC.setCompaniesList(data.items))
      } else throw new Error(message)
   } catch (err: any) {
      yield put(
         ErrorsAC.setErrOnGetCompaniesList(
            cutText(
               err.response?.data?.message || err.message,
               300,
               'Ошибка при загрузке списка компаний, попробуйте перезагрузить страницу'
            )
         )
      )
   }
   yield put(CompaniesAC.setIsLoadingCompaniesList(false))
   yield put(CompaniesAC.setIsCompaniesListRequested())
}

export const getCompaniesListSagaWatcher = function* () {
   yield takeLeading(GET_COMPANIES_LIST, getCompaniesListSagaWorker)
}
