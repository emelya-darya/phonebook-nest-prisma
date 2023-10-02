import { call, put, select, throttle } from 'redux-saga/effects'

import { GlobalStateType } from '../../redux/reduxStore'
import { employeesFetchingAPI } from '../../DAL/fetchingAPI'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { cutText } from '../assets/cutText'
import { SET_CURRENT_COMPANY_IDX_PAGE, SET_CURRENT_PAGE, SET_SEARCH_REQUEST } from '../../redux/admin/constants'
import { AdminAC } from '../../redux/admin/adminReducer'

const handleGetEmployees = function* (currentPage: number, pageSize: number, searchRequest: string, currentCompany: string) {
   yield put(ErrorsAC.setErrOnAdminLoadEmpsList(null))
   yield put(AdminAC.setIsLoadingEmpsList(true))

   try {
      const { statusCode, data, message } = yield call(
         employeesFetchingAPI.getEmployeesPortion,
         currentPage,
         pageSize,
         searchRequest,
         currentCompany
      )

      if (statusCode === 200) {
         yield put(AdminAC.setPortionEmployees(data.items))
         yield put(AdminAC.setTotalEmpsCount(data.totalCount))
      } else throw new Error(message)
   } catch (err: any) {
      yield put(
         ErrorsAC.setErrOnAdminLoadEmpsList(
            cutText(err.response?.data?.message || err.message, 300, 'Ошибка при загрузке списка сотрудников')
         )
      )
   }
   yield put(AdminAC.setIsLoadingEmpsList(false))
}
const sagaWorkerAdminGetEmployees = function* () {
   const { currentPage, pageSize, searchRequest, currentCompany } = yield select((state: GlobalStateType) => state.forAdminData.indexPage)

   if (searchRequest !== null && currentPage !== null) {
      yield handleGetEmployees(currentPage, pageSize, searchRequest, currentCompany)
   }
}

export const sagaWatcherAdminGetEmployees = function* () {
   yield throttle(1500, SET_CURRENT_PAGE, sagaWorkerAdminGetEmployees)
   yield throttle(1500, SET_SEARCH_REQUEST, sagaWorkerAdminGetEmployees)
   yield throttle(1500, SET_CURRENT_COMPANY_IDX_PAGE, sagaWorkerAdminGetEmployees)
}
