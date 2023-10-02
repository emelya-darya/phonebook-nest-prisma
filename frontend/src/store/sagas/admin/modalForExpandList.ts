import { all, call, fork, put, select, takeLeading, throttle } from 'redux-saga/effects'

import { GlobalStateType } from '../../redux/reduxStore'
import { employeesFetchingAPI } from '../../DAL/fetchingAPI'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { cutText } from '../assets/cutText'
import { GET_EXPAND_PORTION_EMPLOYEES_FOR_MODAL, GET_INITIAL_PORTION_EMPLOYEES_FOR_MODAL, SET_SEARCH_REQUEST_FOR_MODAL } from '../../redux/admin/constants'
import { AdminAC } from '../../redux/admin/adminReducer'

const onSearchSagaWorker = function* (action: ReturnType<typeof AdminAC.setSearchRequestForModal>) {
   yield put(ErrorsAC.setErrOnGetInitialPortionForModal(null))
   yield put(AdminAC.setIsLoadingInitialPortionForModal(true))

   try {
      yield put(AdminAC.setCurrentPageForModal(1))
      const { currentPage, pageSize, searchRequest } = yield select((state: GlobalStateType) => state.forAdminData.dataForModalModifyList)
      const { statusCode, data, message } = yield call(employeesFetchingAPI.getEmployeesPortion, currentPage, pageSize, searchRequest)

      if (statusCode === 200) {
         yield put(AdminAC.setInitialEmployeesPortionForModal(data.items))
         yield put(AdminAC.setTotalCountForModal(data.totalCount))
      } else throw new Error(message)
   } catch (err: any) {
      yield put(ErrorsAC.setErrOnGetInitialPortionForModal(cutText(err.response?.data?.message || err.message, 300, 'Ошибка при загрузке списка сотрудников')))
   }
   yield put(AdminAC.setIsLoadingInitialPortionForModal(false))
}

const onSearchSagaWatcher = function* () {
   yield throttle(1500, SET_SEARCH_REQUEST_FOR_MODAL, onSearchSagaWorker)
}

const expandPortionSagaWorker = function* () {
   const { currentPage, pageSize, totalCount, searchRequest } = yield select((state: GlobalStateType) => state.forAdminData.dataForModalModifyList)
   const totalPagesCount = Math.ceil(totalCount / pageSize)

   if (currentPage && totalPagesCount > currentPage) {
      yield put(ErrorsAC.setErrOnExpandPortionForModal(null))
      yield put(AdminAC.setIsLoadingExpandPortionForModal(true))

      try {
         yield put(AdminAC.setCurrentPageForModal(currentPage + 1))
         const { currentPage: updatedCurrPage } = yield select((state: GlobalStateType) => state.forAdminData.dataForModalModifyList)

         const { statusCode, data, message } = yield call(employeesFetchingAPI.getEmployeesPortion, updatedCurrPage, pageSize, searchRequest)

         if (statusCode === 200) {
            yield put(AdminAC.expandEmployeesPortionForModal(data.items))
         } else throw new Error(message)
      } catch (err: any) {
         yield put(ErrorsAC.setErrOnExpandPortionForModal(cutText(err.response?.data?.message || err.message, 100, 'Ошибка при загрузке списка сотрудников')))
      }

      yield put(AdminAC.setIsLoadingExpandPortionForModal(false))
   }
}

const expandPortionSagaWatcher = function* () {
   yield throttle(1500, GET_EXPAND_PORTION_EMPLOYEES_FOR_MODAL, expandPortionSagaWorker)
}

const getInitialPortionSagaWorker = function* () {
   yield put(ErrorsAC.setErrOnGetInitialPortionForModal(null))
   yield put(AdminAC.setIsLoadingInitialPortionForModal(true))

   try {
      yield put(AdminAC.setCurrentPageForModal(1))
      yield put(AdminAC.setSearchRequestForModal(''))
      const { currentPage, pageSize, searchRequest } = yield select((state: GlobalStateType) => state.forAdminData.dataForModalModifyList)
      const { statusCode, data, message } = yield call(employeesFetchingAPI.getEmployeesPortion, currentPage, pageSize, searchRequest)

      if (statusCode === 200) {
         yield put(AdminAC.setInitialEmployeesPortionForModal(data.items))
         yield put(AdminAC.setTotalCountForModal(data.totalCount))
      } else throw new Error(message)
   } catch (err: any) {
      yield put(ErrorsAC.setErrOnGetInitialPortionForModal(cutText(err.response?.data?.message || err.message, 300, 'Ошибка при загрузке списка сотрудников')))
   }
   yield put(AdminAC.setIsLoadingInitialPortionForModal(false))
}

const getInitialPortionSagaWatcher = function* () {
   yield takeLeading(GET_INITIAL_PORTION_EMPLOYEES_FOR_MODAL, getInitialPortionSagaWorker)
}

export const modalForExpandListSagaWatcher = function* () {
   yield all([fork(getInitialPortionSagaWatcher), fork(expandPortionSagaWatcher), fork(onSearchSagaWatcher)])
}
